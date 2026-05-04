import { Component } from "react";

type Props = {
  onSearch: (value: string) => void;
};

type State = {
  value: string;
};

class Search extends Component<Props, State> {
  state: State = {
    value: "",
  };

  componentDidMount() {
  const saved = localStorage.getItem("search");
  if (saved) {
    this.setState({ value: saved });
  }
}

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ value: e.target.value });
  };

  handleSearch = () => {
    const trimmed = this.state.value.trim();

    this.setState({ value: trimmed });
    this.props.onSearch(trimmed);
  };

  render() {
    return (
      <div>
        <input
          value={this.state.value}
          onChange={this.handleChange}
          placeholder="Search..."
        />
        <button onClick={this.handleSearch}>Search</button>
      </div>
    );
  }
}

export default Search;