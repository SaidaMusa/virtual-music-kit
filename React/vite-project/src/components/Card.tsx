import { Component } from "react";

type Person = {
  name: string;
  birth_year: string;
};

type Props = {
  item: Person;
};

class Card extends Component<Props> {
  render() {
    const { name, birth_year } = this.props.item;

    return (
      <div style={{ border: "1px solid gray", margin: 10, padding: 10 }}>
        <h3>{name}</h3>
        <p>Birth Year: {birth_year}</p>
      </div>
    );
  }
}

export default Card;