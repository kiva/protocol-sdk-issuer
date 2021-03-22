describe('The SMS/OTP authentication process', () => {
    before(() => {
        cy.goToSMSScreen();
    });

    it('renders the phone number input field', () => {
        cy.get('.phone-number-input').should('be.visible');
    });

    it('has descriptive instructions', () => {
        cy.get('h4[data-cy="instructions-title"]').should('contain', 'Enter Authentication Details');
        cy.get('[data-cy="instructions-body"]').should('contain', 'Enter the employee\'s preferred phone #. This will be used by the employee to create and access their Cloud Wallet.');
    });

    // TODO: Input field validation

    it('shows an icon showing the request is in progress when "Continue" is clicked', () => {
        cy.intercept('POST', '/guardian/onboard', {
            statusCode: 418,
            delay: 200
        });

        cy.get('.next').click();
        cy.get('.dialog-icon.verifying').should('be.visible');
        cy.wait(200);
    });

    it('renders an error message if the request fails', () => {
        cy.get('.dialog-icon.error').should('be.visible');
    });

    it('notifies the user if their request succeeded', () => {
        cy.goToSMSScreen();
        cy.intercept('POST', '/guardian/onboard', {
            statusCode: 200
        });

        cy.get('.next').click();
        cy.get('.otp-icon').should('be.visible');
        cy.get('[data-cy="cloud-wallet-success"]').should('contain', 'Cloud Wallet created and credentials issued.');
    });
});