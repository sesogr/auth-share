describe("Basic User Follow", () => {
  const newUserData: {
    displayname: string;
    credentials: `${string}:${string}`;
  } = {
    displayname: "hallo",
    credentials: "hallo:hallo",
  };
  it("registration", () => {
    cy.visit("localhost:3000");
    cy.get("#login_form div:nth-child(2) > button.ant-btn > span").click();
    cy.get("#username").click();
    cy.get("#username").type(newUserData.credentials.split(":")[0]);
    cy.get("#displayname").type(newUserData.displayname);
    cy.get("#password").type(newUserData.credentials.split(":")[1]);
    cy.get("#root > div:nth-child(2)").click();
    cy.window().then((win) => {
      cy.spy(win, "fetch").as("fetchSpy");
      cy.get("#root button.ant-btn span").click();
      cy.get("@fetchSpy").should(
        "have.been.calledWith",
        "http://localhost:8000/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newUserData),
        },
      );
    });
  });
});
