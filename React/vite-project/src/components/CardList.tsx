import { Component } from "react";
import Card from "./Card";

type Person = {
  name: string;
  birth_year: string;
};

type Props = {
  data: Person[];
};

class CardList extends Component<Props> {
  render() {
    return (
      <div>
        {this.props.data.map((item, index) => (
          <Card key={index} item={item} />
        ))}
      </div>
    );
  }
}

export default CardList;