// cypress/support/goal_helpers.js
import { faker } from '@faker-js/faker';

export const createGoal = (baseUrl, teamId, apiToken) => {
    const name = faker.company.catchPhrase();
    const description = faker.lorem.sentence();

    return cy.request({
        method: 'POST',
        url: `${baseUrl}/team/${teamId}/goal`,
        headers: { Authorization: apiToken },
        body: {
            name,
            description,
            due_date: Date.now() + 7 * 24 * 60 * 60 * 1000,
            multiple_owners: false,
            owners: []
        }
    });
};

export const updateGoal = (baseUrl, goalId, apiToken, name, description) => {
    return cy.request({
        method: 'PUT',
        url: `${baseUrl}/goal/${goalId}`,
        headers: { Authorization: apiToken },
        body: {
            name,
            description
        }
    });
};

export const deleteGoal = (baseUrl, goalId, apiToken) => {
    return cy.request({
        method: 'DELETE',
        url: `${baseUrl}/goal/${goalId}`,
        headers: { Authorization: apiToken }
    });
};
