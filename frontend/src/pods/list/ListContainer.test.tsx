import { describe, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { ListContainer } from "./ListContainer";
import { TestProviders } from "@/test/utils";
import { server } from "@/test/server/node";
import { http, HttpResponse } from "msw";

describe("ListContainer", () => {
  const renderComponent = () => {
    render(
      <TestProviders>
        <ListContainer />
      </TestProviders>
    );
  };

  it("fetch todos from api", async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getAllByTestId("li").length).toBe(3);
    });
  });

  it("fails to fetch todos from api", async () => {
    server.use(
      http.get("/todos", () => {
        return HttpResponse.json({ message: "Server Error" }, { status: 500 });
      })
    );

    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByText("There were errors loading todos")
      ).toBeInTheDocument();
    });
  });
});
