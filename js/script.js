import { h, render, Component } from "preact";
import { byeIE } from "./byeie"; // loučíme se s IE
/** @jsx h */
byeIE();

const uid = Date.now() + String(Math.round(Math.random() * 10000));

const options = [
  {
    text: "2× týdně vynechám maso ze svého jídelníčku.",
    desc: "Vegani snižují svou stopu asi o 1000 kg, tj. 20 %.",
    id: 0,
    save: 290,
  },
  {
    text: "Vynechám létání (služební i osobní cesty).",
    desc: "Počítáno pro dva zpáteční lety za rok - Praha-Londýn a Praha-Bangkok s mezipřistáním v Dubaji. Jde o konzervativní výpočet, podle jiných propočtů je stopa létání 2-3× vyšší, což navyšuje i celkovou uhlíkovou stopu.",
    id: 1,
    save: 1379,
  },
  {
    text: "Do práce budu jezdit do práce veřejnou dopravou, nikoliv autem.",
    desc: "Cesta autem počítána pro vzdálenost 15 km, spotřebu 7 l benzínu na 100 km, žádné spolucestující a 220 pracovních dní.",
    id: 2,
    save: 890,
  },
  {
    text: "Snížím teplotu vytápění svého domu/bytu o 1 °C.",
    desc: "Konzervativní výpočet snížení spotřeby energie na vytápění o 4 %; uvádí se i 6 %.",
    id: 3,
    save: 40,
  },
  {
    text: "Začnu využívat „zelenou elektřinu“ vyrobenou z obnovitelných zdrojů.",
    desc: "Vychází z šetření Českého statistického úřadu o spotřebě energií v domácnostech.",
    id: 4,
    save: 612,
  },
  {
    text: "Budu třídit biologicky rozložitelný odpad.",
    desc: "Průměrná produkce bioodpadu na osobu a rok; třídění do kompostu či hnědé popelnice.",
    id: 5,
    save: 135,
  },
  {
    text: "Vzdám se 14denní dovolené u moře v hotelu a nahradím ji pobytem v penzionu v ČR či SR.",
    desc: "Počítáno jako dovolená v Thajsku v hotelu all-inclusive oproti dovolené v ČR/SR v penzionu (s dopravou 4 osob autem a celkovou vzdáleností 800 km).",
    id: 6,
    save: 1844,
  },
];

class Klikatko extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: -1,
      sent: false,
      result: 5000, // baseline
    };
  }

  selectData(id, save) {
    this.setState({
      checked: id,
      result: 5000 - save,
    });
  }

  send() {
    const { checked } = this.state;
    fetch("https://o2vm37ssm2.execute-api.eu-central-1.amazonaws.com/prod/uhlikova-stopa", {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: uid, data: checked }),
    })
      .then(this.setState({ sent: true }));
  }

  render() {
    const { checked, sent, result } = this.state;
    return (
      <div id="klikatko-app">
        <div id="header">Kalkulačka snížení uhlíkové stopy</div>
        <form id="klikform">
          <div>Průměrná roční stopa osobní spotřeby je <span className="large">5000 kg CO<sub>2</sub></span>. Vyberte, která cesta snížení uhlíkové stopy je pro vás nejpřijatelnější. Možnosti platí pro celý rok.</div>
          <div className="small">Odhad platí pro průměrného městského člověka, který nežije nijak ekologicky, ale není ani velmi bohatý a neekologický.</div>
          <hr className="snowfall" />
          {options.map(el => (
            <div className="option">
              <div className="option-input">
                <input
                  type="radio"
                  checked={checked === el.id}
                  id={`radio-${el.id}`}
                  onChange={() => this.selectData(el.id, el.save)}
                  disabled={sent}
                  name="select-data"
                />
              </div>
              <label className="option-text" htmlFor={`radio-${el.id}`}>{`${el.text} `}</label>
            </div>
          ))}
          <hr className="snowfall" />
          <div id="result">
            Vybranou cestou se Vaše uhlíková stopa v průměru sníží na <span className="large">{result} kg CO<sub>2</sub></span>, tedy o <span className="large">{Math.round(100 - result / 5000 * 100)} %</span>.&nbsp;
            <span className="small">
              Číslo zahrnuje i další skleníkové plyny (např. metan či oxid dusný) přepočtené na odpovídající hmotnost CO<sub>2</sub>. {checked >= 0 && options.filter(option => option.id === checked)[0].desc}
            </span>
          </div>
          <div id="button-flex">
            <button
              type="button"
              className={!sent ? "btn btn-primary" : "btn btn-sent"}
              onClick={() => this.send()}
              disabled={checked === -1 || sent}
            >
              {!sent ? "Uložit" : "Uloženo!"}
            </button>
          </div>
        </form>
        <div className="small right">Data: <a href="https://ci2.co.cz/cs">CI2, o. p. s.</a></div>
      </div>
    );
  }
}

render(<Klikatko />, document.getElementById("klikatko"));
