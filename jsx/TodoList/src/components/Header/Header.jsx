import translations from "../../l10n";
import "./Header.css";

export default function Header(props) {
    const { amountOfTasks } = props;
    const { lang, setLang } = props;

    const engLang = () => setLang("eng");
    const ruLang = () => setLang("ru");

    return (
        <div className="header">
            <h1 className="header__title">
                {translations[lang].title.replace("xxx", amountOfTasks)}
            </h1>
            <h3 className="header__motivation">
                {translations[lang].motivation}
            </h3>
            <div className="header__buttons">
                <button className="header__lang-btn" onClick={engLang}>
                    English
                </button>
                <button className="header__lang-btn" onClick={ruLang}>
                    Русский
                </button>
            </div>
            <div className="header__current">
                {translations[lang].current}: {lang}
            </div>
            <hr />
        </div>
    );
}