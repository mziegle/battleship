describe('Register', () => {
    it('register user', () => {
        // Arrange
        cy.visit('http://localhost:8888');
        cy.contains('Register').click();
        cy.url().should('include', '/register')

        // Act
        cy.get('[data-cy=username]')
        .type('Alexander')
        .should('have.value', 'Alexander')
        cy.get('[data-cy=password]')
        .type('secret');
        cy.get('[data-cy=password-repeated]')
        .type('secret');
        cy.get('[data-cy=submit]').click();

        // Assert
        cy.url().should('include', '/fleet')  
    });
})