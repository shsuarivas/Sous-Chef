import style from './TitleBar.module.scss'

function TitleBar() {
  return (
    <>
      <div className={style.title_div}>
        <div className={style.logo}>
          Logo
        </div>

        <div className={style.search_bar}>
          <input type="text"></input>
        </div>

        <div className={style.login_buttons}>
          <input type="button" value="Log in"></input>
          <input type="button" value="Sign up"></input>
        </div>
      </div>
    </>
  );
}

export default TitleBar;