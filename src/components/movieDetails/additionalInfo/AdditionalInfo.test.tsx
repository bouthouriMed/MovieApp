import { render } from "@testing-library/react";
import { mockedMovie } from "@/__mocks__/test_mocks";
import AdditionalInfo from "./AdditionalInfo";

describe("AdditionalInfo", () => {
  it("matches snapshot", () => {
    const { container } = render(<AdditionalInfo movie={mockedMovie} />);

    expect(container).toMatchSnapshot();
  });
});
