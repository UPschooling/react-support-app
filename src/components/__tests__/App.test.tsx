import {render} from "@testing-library/react";

import {App} from "../App";

describe("<App />", () => {
  it("should render hello world", () => {
    const container = render(<App />);
    expect(container.getByText("Hello World!")).toBeInTheDocument();
  });
});
