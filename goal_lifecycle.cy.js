import { faker } from '@faker-js/faker';
import { createSpace, createList } from '../../support/api_helpers';
import { createGoal, updateGoal, deleteGoal } from '../../support/goal_helpers';

describe('ClickUp Goal API Lifecycle', () => {
    it('creates, updates and deletes a goal', () => {
        const apiToken = Cypress.env('apiToken');
        const teamId = Cypress.env('teamId');
        const baseUrl = Cypress.env('baseUrl');

        let spaceId;
        let listId;
        let goalId;

        createSpace(baseUrl, teamId, apiToken).then((res) => {
            expect(res.status).to.equal(200);
            spaceId = res.body.id;

            createList(baseUrl, spaceId, apiToken).then((res) => {
                expect(res.status).to.equal(200);
                listId = res.body.id;

                createGoal(baseUrl, teamId, apiToken).then((res) => {
                    expect(res.status).to.equal(200);
                    goalId = res.body.goal.id;

                    cy.request({
                        method: 'GET',
                        url: `${baseUrl}/team/${teamId}/goal`,
                        headers: { Authorization: apiToken }
                    }).then((res) => {
                        expect(res.status).to.equal(200);
                        const goal = res.body.goals.find((g) => g.id === goalId);
                        expect(goal).to.not.be.undefined;

                        const updatedName = `Updated: ${faker.company.name()}`;
                        const updatedDesc = `Updated: ${faker.lorem.sentence()}`;

                        updateGoal(baseUrl, goalId, apiToken, updatedName, updatedDesc).then((res) => {
                            expect(res.status).to.equal(200);

                            cy.request({
                                method: 'GET',
                                url: `${baseUrl}/goal/${goalId}`,
                                headers: { Authorization: apiToken }
                            }).then((res) => {
                                expect(res.status).to.equal(200);
                                expect(res.body.goal.name).to.equal(updatedName);
                                expect(res.body.goal.description).to.equal(updatedDesc);

                                cy.request({
                                    method: 'GET',
                                    url: `${baseUrl}/goal/${goalId}`,
                                    headers: { Authorization: 'Bearer wrong_token' },
                                    failOnStatusCode: false
                                }).then((res) => {
                                    expect(res.status).to.equal(401);

                                    deleteGoal(baseUrl, goalId, apiToken).then((res) => {
                                        expect(res.status).to.equal(200);

                                        cy.request({
                                            method: 'GET',
                                            url: `${baseUrl}/goal/${goalId}`,
                                            headers: { Authorization: apiToken },
                                            failOnStatusCode: false
                                        }).then((res) => {
                                            expect(res.status).to.equal(404);
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});
