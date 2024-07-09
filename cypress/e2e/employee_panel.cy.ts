import { User } from "../support/constants";

describe('Employee Panel', () => {
  let user: User;

  beforeEach(() => {
    // Sign up a user before each test
    cy.signUp().then((createdUser) => {
      user = createdUser;

      // loads the employee panel from dashboard first
      cy.visit('/dashboard/')

      cy.contains('button', user.fullName)
        .should('exist')
        .click()
    });
  });

  afterEach(() => {
    // Delete the user after each test
    deleteEmployee(user.fullName);
  });

  it('View employee data', () => {
    cy.get('#validationFullName')
      .should('have.value', user.fullName)

    cy.get('#validationEmail')
      .should('have.value', user.email)

    cy.get('#validationPosition')
      .should('have.value', user.position)

    cy.contains('button', user.department)
      .should('exist')

    cy.get('#salaryGroup')
      .should('exist')
      .should('have.value', user.salary);

      cy.get('#startDateGroup')
      .should('exist')
      .should('have.value', user.startDate.toISOString().split('T')[0]);

    const currentDate = new Date()

    cy.get('input[placeholder="Created At"]')
      .should('have.value', currentDate.toISOString().split('T')[0]);

    cy.get('input[placeholder="Updated At"]')
      .should('have.value', currentDate.toISOString().split('T')[0]);
  })

  describe('Edit employee data', () => {
    let user: User;

    beforeEach(() => {
      // Sign up a user before each test
      cy.signUp().then((createdUser) => {
        user = createdUser;

        // loads the employee panel from dashboard first
        cy.visit('/dashboard/')

        cy.contains('button', user.fullName)
          .should('exist')
          .click()
      });
    });

    afterEach(() => {
      // Delete the user after each test
      deleteEmployee(user.fullName);
    });

    describe('when data is invalid', () => {
      it('returns an error message', ()=>{
        cy.get('#validationFullName')
          .clear()
          .type('a')

        cy.contains('div', "Please type the employee's full name.").should('exist');

        cy.get('#validationEmail')
          .clear()
          .type('b')

        cy.contains('div', "Please choose a valid Email").should('exist');

        cy.get('#validationPosition')
          .clear()
          .type('c')

        cy.contains('div', "Please choose a position").should('exist');

        cy.get('[data-testid="update-button"]')
          .should('exist')
          .should('be.disabled')
      })
    })
  })

  describe('Creates new employee', () => {
    it('creates an employee with success', ()=>{
      cy.signUp()
      .then((user: User) => {
        cy.url().should('include', '/dashboard/');

        deleteEmployee(user.fullName);
      })
    })
  })

  describe('Back Button', () => {
    let user: User;

    beforeEach(() => {
      // Sign up a user before each test
      cy.signUp().then((createdUser) => {
        user = createdUser;

        // loads the employee panel from dashboard first
        cy.visit('/dashboard/')

        cy.contains('button', user.fullName)
          .should('exist')
          .click()
      });
    });

    afterEach(() => {
      // Delete the user after each test
      deleteEmployee(user.fullName);
    });

    it('returns to dashboard page', ()=>{
      cy.get('a[aria-label="Back to Dashboard"]')
        .should('exist')
        .click();

      cy.url().should('eq', `${Cypress.config('baseUrl')}/dashboard/`)
    })
  })
})

const deleteEmployee = (name: string) => {
  cy.visit('/dashboard/')

  cy.contains('button', name)
    .should('exist')
    .click()

  // opens the modal to confirm
  cy.contains('button', 'Delete Employee')
    .should('exist')
    .click()

  cy.get('div[role="dialog"]')
    .should('be.visible')
    .within(() => {
      cy.contains('button', 'Delete')
      .should('exist')
      .click({ force: true })
    });
}