/// <reference types="Cypress" />

describe('Landing Page', () => {
  beforeEach(()=>{
    cy.visit('/dashboard/');
  });

  it('renders the page with a list of employees', () => {
    cy.get('h1')
      .should('exist')
      .should('contain', 'Employee Dashboard');

    cy.get('.list-group-item')
      .should('have.length.at.least', 4);
  })

  it('views the page in responsive mode', ()=>{
    cy.viewport('iphone-6')
    cy.visit('/dashboard/')

    cy.get('.list-group-item')
      .should('have.length.at.least', 4);
  })

  describe('Sort by', ()=>{
    it('sorts each row by the first name', ()=>{
      cy.get('[data-testid="sort-button"]')
        .should('exist')
        .click();

      cy.wait(2000);

      cy.get('.list-group-item > .row').then(rows => {
        // Extract text from each row's first column (excluding the header)
        const names = [];
        for (let i = 1; i < rows.length; i++) {
          names.push((rows[i].children[0] as HTMLElement).innerText);
        }

        // Create a sorted version of the names array
        const sortedNames = [...names].sort();

        // Assert that the names are sorted correctly
        expect(names).to.deep.equal(sortedNames);
      });
    })
  });

  describe('Search input', ()=>{
    it('should return specific items for a text search', ()=>{

      cy.get('input[placeholder="Search by name or position"]')
        .should('be.visible')
        .type('John')

      cy.contains('div', 'John Snow');
    });
  });

  describe('Filter by', ()=>{
    it('returns only rows for the Sales department', ()=>{
      cy.get('[data-testid="departments-filter-dropdown"]')
        .should('exist')
        .click()

      cy.get('[data-testid="departments-filter-button-Sales"]')
        .should('exist')
        .click()

      cy.wait(2000)

      cy.get('.list-group-item > .row')
        .then(rows => {
          // Extract text from each row's first column (excluding the header)
          for (let i = 1; i < rows.length; i++) {
            const departmentColumn = rows[i].children[2] as HTMLElement;
            expect(departmentColumn.innerText).to.be.eq('Sales');
          }
        });
    })
  });

  describe('Create new Employee button', ()=>{
    it('navigates to the new employee panel', ()=>{
      cy.get('[data-testid="new-employee-button"]')
        .should('be.visible')
        .click()

      cy.url().should('eq', `${Cypress.config('baseUrl')}/employees/`)
    })
  });

  describe('Clicking on the user from the list', ()=>{
    it.only('navigates to edit the employee panel', ()=>{
      cy.get('[data-testid^="employee-row-"]').first().then(($el) => {
        // Get the data-testid attribute value
        const dataTestId = $el.attr('data-testid');

        // Extract the dynamic part of the id (the part after "employee-row-")
        const employeeId = dataTestId.replace('employee-row-', '');

        // Click on the first row
        cy.wrap($el).click();

        // Verify the URL after the click
        cy.url().should('eq', `${Cypress.config('baseUrl')}/employees/${employeeId}`);
      });
    })
  });
});

export {};