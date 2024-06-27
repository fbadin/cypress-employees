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

const { faker } = require('@faker-js/faker');

export type User = {
  fullName: string;
  email: string;
  password: string;
}

Cypress.Commands.add('signUp' as any, () => {
  let fullName: string;
    do {
      fullName = faker.person.fullName();
    } while (fullName.split(' ').length < 2);

  const user: User = {
    fullName: fullName,
    email: faker.internet.email(),
    password: 'Password123'
  };

  cy.visit('/');

  // Fill in the full name
  cy.get('#id-user-name')
    .type(fullName)
    .should('have.value', fullName)

  // Fill in the email
  cy.get('#id-email')
    .type(user.email)
    .should('have.value', user.email)

  // The password fields should now be visible
  cy.get('#user_password1')
    .should('be.visible')
    .type(user.password)
    .should('have.value', user.password)

  cy.get('#user_password2')
    .should('be.visible')
    .type(user.password)
    .should('have.value', user.password)

  // Enable the sign up button
  cy.get('#id-btn-sign-up').should('not.be.disabled')

  // Click the sign up button
  cy.get('#id-btn-sign-up').click()

  cy.url().should('include', '/users/verify-email');

  // avoid sending the user with the verification code, and flooding the email box.
  cy.intercept("/api/v1/users/send_verification_code_email/", {})

  cy.get('.email-label').should('contain', user.email.toLowerCase())

  // hack to bypass verification code in debug mode
  cy.get('#input-verification-code')
    .should('be.visible')
    .type('111111')
    .should('have.value', '111111')

  cy.get('#btn-continue')
    .should('be.enabled')
    .click();

  // dismiss the welcome modal
  cy.get('[data-testid="welcome-modal-close-button"]', { timeout: 5000 }) // Wait up to 5 seconds
    .should('exist') // Ensure the element exists
    .should('be.visible') // Ensure the element is visible
    .click(); // Click the button

  // wraps the user for later use. this should be the last code.
  cy.wrap(user)
    .as('user')
    .then((user) => {
      return user;
    });
});