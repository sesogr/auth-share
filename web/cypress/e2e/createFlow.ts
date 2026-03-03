function createFlow() {
  cy.visit("http://localhost:3000");
  cy.get("#login_form div:nth-child(2) > button.ant-btn > span").click();
  cy.get("#username").click();
  cy.get("#username").type("hallo123");
  cy.get("#displayname").type("hallo1");
  cy.get("#password").type("hallo123");
  cy.get("#root button.ant-btn span").click();
  cy.get("#username").should("have.value", "");
  cy.get("#displayname").should("have.value", "");
  cy.get("#password").should("have.value", "");
}
export default createFlow;
