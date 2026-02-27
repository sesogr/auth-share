import { SendingConvertedUser } from "../../src/types/ConvertedUser.ts";
describe("Basic User Follow", () => {
  const newUserData: SendingConvertedUser = {
    displayname: "hallo",
    credentials: "hallo:hallo",
  };
  it("registration", () => {
    cy.visit("localhost:3000");
    cy.get("#login_form div:nth-child(2) > button.ant-btn > span").click();
    cy.get("#username").click();
    cy.get("#username").type("hallo");
    cy.get("#displayname").type("hallo");
    cy.get("#password").type("hallo");
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
