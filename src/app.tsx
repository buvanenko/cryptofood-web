import styles from "./styles/home.module.css";
import { Web3Button } from "@web3modal/react";
import { FormEvent, useState } from "react";
import { Button } from "./components";
import { useAccount } from "wagmi";
import axios from "axios";
import toast from "react-hot-toast";
import * as Dialog from "@radix-ui/react-dialog";
import { animated, useTransition } from "@react-spring/web";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { formAtom } from "./atoms/form-atom";

export default function App() {
  const form = useRecoilValue(formAtom);
  const [loading, setLoading] = useState<boolean>(false);
  const wallet = useAccount();

  const handleClick = () => {
    setLoading(true);
    let getLink = axios.get("https://food.sovietgirls.su/food", {
      params: {
        address: form.address,
        name: form.name,
        contact: form.contact,
        wallet: wallet.address,
      },
    });

    toast
      .promise(
        getLink,
        {
          loading: "Загрузка...",
          success: "Успешно!",
          error: "Не удалось отправить запрос :(",
        },
        {
          id: "send_form",
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
            <h1>Привет! Заполни форму и получи NFT-пиццу!</h1>
            <div className={styles.content}>
              <ol>
                <li>
                  <div
                    style={{
                      display: "inline-block",
                      verticalAlign: "bottom",
                    }}
                  >
                    <FeedbackForm />
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
                      disabled={!wallet.address || !form.name || !form.address || !form.contact}
                      loading={loading}
                      onClick={handleClick}
                    >
                      Отправить
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

const FeedbackForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const setForm = useSetRecoilState(formAtom);

  const [name, setName] = useState<string>();
  const [address, setAddress] = useState<string>();
  const [contact, setContact] = useState<string>();

  const handleDialogChange = (isOpen: boolean) => setIsOpen(isOpen);
  const transition = useTransition(isOpen, {
    from: {
      opacity: 0,
      transform: "translate(-50%, -48%) scale(0.96)",
    },
    enter: {
      opacity: 1,
      transform: "translate(-50%, -50%) scale(1)",
    },
    leave: {
      opacity: 0,
      transform: "translate(-50%, -48%) scale(0.96)",
    },
    config: {
      friction: 50,
      tension: 400,
      clamp: true,
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setForm({
      address,
      name,
      contact,
    });
  };

  const AnimatedOverlay = animated(Dialog.Overlay);
  const AnimatedContent = animated(Dialog.Content);

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleDialogChange}>
      <Dialog.Trigger asChild>
        <Button>Заполнить форму</Button>
      </Dialog.Trigger>
      <Dialog.Portal forceMount>
        {transition((style, isOpen) => (
          <>
            {isOpen ? (
              <AnimatedOverlay
                className={`${styles.DialogOverlay}`}
                style={{
                  opacity: style.opacity,
                }}
              />
            ) : null}
            {isOpen ? (
              <AnimatedContent
                style={{
                  opacity: style.opacity,
                  transform: style.transform,
                }}
                className={`${styles.DialogContent}`}
              >
                <Dialog.Title className={`${styles.DialogTitle}`}>
                  Заполните форму
                </Dialog.Title>
                <form
                  style={{
                    marginTop: 20,
                  }}
                  onSubmit={(e) => handleSubmit(e)}
                >
                  <fieldset className={`${styles.Fieldset}`}>
                    <label className={`${styles.Label}`} htmlFor="address">
                      Адрес
                    </label>
                    <input
                      className={`${styles.Input}`}
                      id="address"
                      defaultValue={address}
                      placeholder={"Ваш адрес"}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </fieldset>
                  <fieldset className={`${styles.Fieldset}`}>
                    <label className={`${styles.Label}`} htmlFor="name">
                      Имя
                    </label>
                    <input
                      className={`${styles.Input}`}
                      id="name"
                      placeholder={"Ваше имя"}
                      defaultValue={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </fieldset>
                  <div className={`${styles.DialogDescription}`}>
                    Как мы бы могли с вами связаться? Укажите ссылку на
                    Telegram/ВКонтакте или оставьте свой email адрес.
                  </div>
                  <fieldset className={`${styles.Fieldset}`}>
                    <label className={`${styles.Label}`} htmlFor="contact">
                      Контакт
                    </label>
                    <input
                      className={`${styles.Input}`}
                      id="contact"
                      defaultValue={contact}
                      placeholder={"example@example.com"}
                      onChange={(e) => setContact(e.target.value)}
                    />
                  </fieldset>
                  <div
                    style={{
                      display: "flex",
                      marginTop: 25,
                      justifyContent: "flex-end",
                    }}
                  >
                    <Dialog.Close asChild>
                      <Button
                        disabled={!address || !name || !contact}
                        type={"submit"}
                      >
                        Сохранить
                      </Button>
                    </Dialog.Close>
                  </div>
                </form>
                <Dialog.Close asChild>
                  <button className={`${styles.IconButton}`} aria-label="Close">
                    Х
                  </button>
                </Dialog.Close>
              </AnimatedContent>
            ) : null}
          </>
        ))}
      </Dialog.Portal>
    </Dialog.Root>
  );
};
