describe("Registration and Deletion", () => {
  const userInfo = {
    displayname: "hallo123",
    username: "hallo123",
    password: "hallo123",
  };
  it("create", () => {
    cy.visit("http://localhost:3000");
    cy.get("#login_form div:nth-child(2) > button.ant-btn > span").click();
    cy.get("#username").click();
    cy.get("#username").type(userInfo.username);
    cy.get("#displayname").type(userInfo.displayname);
    cy.get("#password").type(userInfo.password);
    cy.get("#root button.ant-btn span").click();
    cy.get("#username").should("have.value", "");
    cy.get("#displayname").should("have.value", "");
    cy.get("#password").should("have.value", "");
  });
  it("login", () => {
    cy.visit("http://localhost:3000");

    cy.get("#login_form_username").click();
    cy.get("#login_form_username").type(userInfo.username);
    cy.get("#login_form_password").type(userInfo.password);
    cy.get("#login_form button.ant-btn-block span").click();
    cy.get("nav > span").should("have.text", userInfo.username);
  });

  it("delete", () => {
    cy.visit("http://localhost:3000");

    cy.get("#login_form_username").click();
    cy.get("#login_form_username").type(userInfo.username);
    cy.get("#login_form_password").type(userInfo.password + "{enter}");
    cy.get("#login_form button.ant-btn-block").click();
    cy.get(`#root a[href="/user/${userInfo.displayname}"]`).click();
    cy.get("#root button.ant-btn-dangerous span").click();
  });
});
