import { h, render, Component } from "preact";
import { byeIE } from "./byeie"; // loučíme se s IE
/** @jsx h */
byeIE();

const uid = Date.now() + String(Math.round(Math.random() * 10000));

const options = [
  {
    text: "Jsem ochotný 2x týdně vynechat maso ze svého jídelníčku?",
    id: 0,
    save: 1300,
  },
  {
    text: "Jsem ochotný v příštím roce vynechat létání (služební i osobní cesty)?",
    id: 1,
    save: 700,
  },
  {
    text: "Jsem ochotný jezdit do práce veřejnou dopravou, nikoliv autem?",
    id: 2,
    save: 2300,
  },
  {
    text: "Jsem ochotný začít využívat “zelenou elektřinu”?",
    id: 3,
    save: 6994,
  },
  {
    text: "Jsem ochotný třídit bioodpad?",
    id: 4,
    save: 13,
  },
  {
    text: "Jsem ochotný vzdát se 14-denní dovolené u moře v hotelu a nahradit ji pobytem v penzionu v ČR či SR?",
    id: 5,
    save: 820,
  },
];

class Klikatko extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedIds: [],
      sent: false,
      result: 20000, // baseline
    };
  }

  selectData(id, save, event) {
    const { checkedIds, result } = this.state;

    const isSelected = event.currentTarget.checked;
    if (isSelected) {
      this.setState({
        checkedIds: [...checkedIds, id],
        result: result - save,
      });
    } else {
      this.setState({
        checkedIds: checkedIds.filter(item => id !== item),
        result: result + save,
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
    const { checkedIds, sent, result } = this.state;
    return (
      <div>
        <form id="klikform">
          <div>Čeho byste se byli nejvíc ochotní vzdát? Vyberte jednu až tři věci.</div>
          {options.map(el => (
            <div>
              <span>{`${el.text} `}</span>
              <input
                type="checkbox"
                checked={checkedIds.includes(el.id)}
                onChange={e => this.selectData(el.id, el.save, e)}
                disabled={(checkedIds.length >= 3 && !checkedIds.includes(el.id)) || sent}
                name="select-data"
              />
            </div>
          ))}
          <button
            type="button"
            className={!sent ? "btn btn-primary" : "btn btn-sent"}
            onClick={() => this.send()}
            disabled={!(checkedIds.length > 0 && !sent)}
          >
            {!sent ? "Odeslat" : "Odesláno!"}
          </button>
        </form>
        <div id="result">
          {`Vaše uhlíková stopa je ${result}`}
        </div>
      </div>
    );
  }
}

render(<Klikatko />, document.getElementById("klikatko"));
