describe('The Authentication Options Menu screen', () => {

    before(() => {
        cy.visit('/');
        cy.contains('Accept').click();
    });

    it('has descriptive instructions', () => {
        cy.get('.auth_instructions').should('contain', 'Select an issuing method');
    });

    it('has two menu options for authenticating', () => {
        cy.selectAuthMenuItem().should(menuItems => {
            expect(menuItems.length).to.eql(2);
        });
    });

    it('has the first option selected by default', () => {
        cy.selectAuthMenuItem().eq(0).should('have.class', 'selected');
    });

    it('changes the selection when the second menu item is clicked', () => {
        cy.selectAuthMenuItem().eq(1).click();
        cy.selectAuthMenuItem().eq(1).should('have.class', 'selected');
    });

    it('displays the text from the configuration file correctly', () => {
        // First item
        cy.selectAuthMenuItem().eq(0).get('h2').should('contain', 'Issue Credential to Mobile Wallet');

        // Second item
        cy.selectAuthMenuItem().eq(1).get('h2').should('contain', 'Create Cloud Wallet');
    });

    it('successfully navigates to the webcam/upload screen after clicking "Continue" when "Mobile Wallet" is selected', () => {
        cy.selectAuthMenuItem().eq(0).click();
        cy.get('#select-auth-method').click();
        cy.get('[data-cy="image-selection"]').should('be.visible');

        // Done? Let's go back to menu screen
        cy.get('[data-cy="image-select-back"]').click();
    });

    it('successfully navigates to the webcam/upload screen after clicking "Continue" when "SMS" is selected', () => {
        cy.selectAuthMenuItem().eq(1).click();
        cy.get('#select-auth-method').click();
        cy.get('[data-cy="image-selection"]').should('be.visible');

        // Done? Let's go back to menu screen
        cy.get('[data-cy="image-select-back"]').click();
    });
});