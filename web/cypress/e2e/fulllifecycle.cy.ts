describe("Registration and Deletion", async () => {
  const userInfo = {
    displayname: "hallo123",
    username: "hallo123",
    password: "hallo123",
  };
  const createFlow = (await import("./createFlow.ts")).default;
  it("create", createFlow);
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
