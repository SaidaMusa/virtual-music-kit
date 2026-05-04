import { Component } from "react";
import Search from "./components/Search";
import CardList from "./components/CardList";
import Loader from "./components/Loader";
import "./App.css";

type Person = {
  name: string;
  birth_year: string;
};

type State = {
  data: Person[];
  loading: boolean;
  error: string;
  search: string;
  page: number;
  count: number;
};

class App extends Component<{}, State> {
  state: State = {
    data: [],
    loading: false,
    error: "",
    search: "",
    page: 1,
    count: 0,
  };

  fetchData = async (search: string, page: number) => {
    try {
      this.setState({ loading: true, error: "" });

      const res = await fetch(
        `https://swapi.dev/api/people/?search=${search}&page=${page}`
      );

      if (!res.ok) throw new Error("Server error");

      const data = await res.json();

      this.setState({
        data: data.results,
        count: data.count,
        loading: false,
      });
    } catch (err) {
      this.setState({
        error: err instanceof Error ? err.message : "Unknown error",
        loading: false,
      });
    }
  };

  componentDidMount() {
    const savedSearch = localStorage.getItem("search") || "";

    this.setState({ search: savedSearch }, () => {
      this.fetchData(savedSearch, 1);
    });
  }

  handleSearch = (value: string) => {
    const trimmed = value.trim();

    if (trimmed === this.state.search) return;

    localStorage.setItem("search", trimmed);

    this.setState({ search: trimmed, page: 1 }, () => {
      this.fetchData(trimmed, 1);
    });
  };

  nextPage = () => {
    const next = this.state.page + 1;

    this.setState({ page: next }, () => {
      this.fetchData(this.state.search, next);
    });
  };

  prevPage = () => {
    if (this.state.page === 1) return;

    const prev = this.state.page - 1;

    this.setState({ page: prev }, () => {
      this.fetchData(this.state.search, prev);
    });
  };

  render() {
    return (
        <div className="app">
          <div className="container">

            {/* TOP SECTION */}
            <header className="top-controls">
              <Search onSearch={this.handleSearch} />
            </header>

            {/* RESULTS SECTION */}
            <main className="content">

              {this.state.loading && <Loader />}

              {this.state.error && (
                <div className="error">{this.state.error}</div>
              )}

              <CardList data={this.state.data} />

              <div className="pagination">
                <button onClick={this.prevPage} disabled={this.state.page === 1}>
                  Prev
                </button>

                <span>Page: {this.state.page}</span>

                <button onClick={this.nextPage}>Next</button>
              </div>

            </main>
          </div>
        </div>
    );
  }
}

export default App;