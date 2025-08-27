import { render } from "@testing-library/react";
import Loading from "./LoadingIndicator";

describe("LoadingIndicator", () => {
  it("matches snapshot", () => {
    const { container } = render(<Loading />);
    expect(container).toMatchSnapshot();
  });
});
