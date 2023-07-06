import styles from "./styles/Home.module.css";
import { Web3Button } from "@web3modal/react";
import { useEffect, useState } from "react";
import { IUserType, VkAuth } from "./components";
import { Button } from "./components";
import { useAccount } from "wagmi";
import axios from "axios";
import toast from "react-hot-toast";

export default function App() {
  const [user, setUser] = useState<IUserType>({
    expire: 0,
    mid: "",
    secret: "",
    sig: "",
    sid: "",
    id: undefined,
    can_access_closed: false,
    is_closed: false,
    first_name: "",
    last_name: "",
    photo_400_orig: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const wallet = useAccount();

  useEffect(() => {
    console.log(!wallet.address, !user?.id);
  }, [wallet]);

  const handleClick = () => {
    setLoading(true);
    let getLink = axios.get("http://127.0.0.1:5000/login", {
      params: {
        expire: user?.expire,
        mid: user?.mid,
        secret: user?.secret,
        sig: user?.sig,
        sid: user?.sid,
        wallet: wallet.address,
      },
    });

    toast
      .promise(
        getLink,
        {
          loading: "Загрузка...",
          success: (data) => (
            <>
              <div>
                Успешно!
                <span
                  style={{ borderLeft: "1px solid white", marginLeft: "5px" }}
                ></span>
                <button
                  onClick={() => window.open(data.data.link, "_blank")}
                  className={styles.toast_button}
                >
                  Перейти
                </button>
              </div>
            </>
          ),
          error: "Не удалось получить ссылку :(",
        },
        {
          id: "get_link",
          style: {
            borderRadius: "1.5rem",
            background: "hsl(var(--h), 1%, 10%)",
            color: "#fff",
            boxShadow: "var(--shadow-lg)",
          },
          success: {
            duration: 10000,
          },
        }
      )
      .then(() => setLoading(false))
      .catch(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <main className={styles.main}>
        <div className={styles.wrapper}>
          <div className={styles.container}>
            <h1>Получение ссылки на беседу</h1>
            <div className={styles.content}>
              <ol>
                <li>
                  <div
                    style={{
                      display: "inline-block",
                      verticalAlign: "bottom",
                    }}
                  >
                    <VkAuth user={user} setUser={setUser} />
                  </div>
                </li>
                <li>
                  <div
                    style={{
                      display: "inline-block",
                      verticalAlign: "bottom",
                    }}
                  >
                    <Web3Button label={"Подключить кошелёк"} />
                  </div>
                </li>
                <li>
                  <div
                    style={{
                      display: "inline-block",
                      verticalAlign: "bottom",
                    }}
                  >
                    <Button
                      disabled={!wallet.address || !user.id}
                      loading={loading}
                      onClick={handleClick}
                    >
                      Получить ссылку
                    </Button>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
