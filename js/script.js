import { h, render, Component } from "preact";
import { byeIE } from "./byeie"; // loučíme se s IE
/** @jsx h */
byeIE();

const uid = Date.now() + String(Math.round(Math.random() * 10000));

const options = [
  {
    text: "Jsem ochotný 2x týdně vynechat maso ze svého jídelníčku?",
    id: 0,
  },
  {
    text: "Jsem ochotný v příštím roce vynechat létání (služební i osobní cesty)?",
    id: 1,
  },
  {
    text: "Jsem ochotný jezdit do práce veřejnou dopravou, nikoliv autem?",
    id: 2,
  },
  {
    text: "Jsem ochotný začít využívat “zelenou elektřinu”?",
    id: 3,
  },
  {
    text: "Jsem ochotný třídit bioodpad?",
    id: 4,
  },
  {
    text: "Jsem ochotný vzdát se 14-denní dovolené u moře v hotelu a nahradit ji pobytem v penzionu v ČR či SR?",
    id: 5,
  },
];

class Klikatko extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedIds: [],
      sent: false,
    };
  }

  selectData(id, event) {
    const { checkedIds } = this.state;

    const isSelected = event.currentTarget.checked;
    if (isSelected) {
      this.setState({ checkedIds: [...checkedIds, id] });
    } else {
      this.setState({
        checkedIds:
          checkedIds.filter(item => id !== item),
      });
    }
  }

  send() {
    const { checkedIds } = this.state;
    fetch("https://o2vm37ssm2.execute-api.eu-central-1.amazonaws.com/prod/uhlikova-stopa", {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: uid, data: checkedIds }),
    })
      .then(this.setState({ sent: true }));
  }

  render() {
    const { checkedIds, sent } = this.state;
    return (
      <form id="klikform">
        <div>Vyberte tři:</div>
        {options.map(el => (
          <div>
            <span>{`${el.text} `}</span>
            <input
              type="checkbox"
              checked={checkedIds.includes(el.id)}
              onChange={e => this.selectData(el.id, e)}
              disabled={(checkedIds.length >= 3 && !checkedIds.includes(el.id)) || sent}
              name="select-data"
            />
          </div>
        ))}
        <button
          type="button"
          className={!sent ? "btn btn-primary" : "btn btn-sent"}
          onClick={() => this.send()}
          disabled={!(checkedIds.length === 3 && !sent)}
        >
          {!sent ? "Odeslat" : "Odesláno!"}
        </button>
      </form>
    );
  }
}

render(<Klikatko />, document.getElementById("klikatko"));
