// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import { DEPARTMENTS, User } from "./constants";
import { getRandomSalary } from "./utils";

const { faker } = require('@faker-js/faker');

Cypress.Commands.add('signUp' as any, () => {
  cy.visit('/employees/');

  let fullName: string;
  do {
    fullName = faker.person.fullName();
  } while (fullName.split(' ').length < 2);

  const user: User = {
    fullName: fullName,
    email: faker.internet.email(),
    position: faker.name.jobTitle(),
    department: DEPARTMENTS[Math.floor(Math.random() * DEPARTMENTS.length)],
    salary: getRandomSalary(),
    startDate: new Date()
  };

  cy.get('#validationFullName')
    .type(fullName)
    .should('have.value', fullName)

  cy.get('#validationEmail')
    .type(user.email)
    .should('have.value', user.email)

  cy.get('#validationPosition')
    .type(user.position)
    .should('have.value', user.position)

  cy.contains('button', 'Engineering')
    .click()

  cy.contains('a', user.department)
    .should('exist')
    .click()

  cy.get('#salaryGroup')
    .should('exist')
    .type(user.salary.toString())

  cy.get('#startDateGroup')
    .should('exist')
    .type(user.startDate.toISOString().split('T')[0]);

  cy.get('[data-testid="save-button"]')
    .should('exist')
    .should('be.enabled')
    .click();

  cy.url().should('includes', '/dashboard/');

  // wraps the user for later use. this should be the last code.
  cy.wrap(user)
    .as('user')
    .then((user) => {
      return user;
    });
});