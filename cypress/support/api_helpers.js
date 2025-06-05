
import { faker } from '@faker-js/faker';

export const createSpace = (baseUrl, teamId, apiToken) => {
    const name = faker.company.name();

    return cy.request({
        method: 'POST',
        url: `${baseUrl}/team/${teamId}/space`,
        headers: { Authorization: apiToken },
        body: {
            name,
            multiple_assignees: true,
            features: {
                due_dates: { enabled: true },
                time_tracking: { enabled: false },
                tags: { enabled: true },
                time_estimates: { enabled: true },
                checklists: { enabled: true },
                custom_fields: { enabled: true },
                remap_dependencies: { enabled: true },
                dependency_warning: { enabled: true },
                portfolios: { enabled: true }
            }
        }
    });
};

export const createList = (baseUrl, spaceId, apiToken) => {
    const name = faker.commerce.department();

    return cy.request({
        method: 'POST',
        url: `${baseUrl}/space/${spaceId}/list`,
        headers: { Authorization: apiToken },
        body: {
            name
        }
    });
};
