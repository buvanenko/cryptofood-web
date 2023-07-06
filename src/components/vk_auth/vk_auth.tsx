import React, { FC, useEffect, useState } from "react";
import styles from "./VkAuth.module.css";
import VkLogo from "../../static/vk_logo.svg";
import Button from "../button/button";
import VK from './openapi.js'

interface VKConnectionType {
  session: SessionType;
  status: string;
}

export interface SessionType {
  expire: number;
  mid: string;
  secret: string;
  sid: string;
  sig: string;
  user: SessionUserType;
}

interface SessionUserType {
  domain: string;
  first_name: string;
  href: string;
  id: string;
  last_name: string;
}

export interface UserType {
  can_access_closed: boolean;
  first_name: string;
  id?: number;
  is_closed: boolean;
  last_name: string;
  photo_400_orig: string;
}

export type IUserType = Omit<SessionType, "user"> & UserType;

export const VkAuth: FC<{
  user: IUserType;
  setUser: React.Dispatch<React.SetStateAction<IUserType>>;
}> = ({ user, setUser }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [action, setAction] = useState<string | undefined>();

  useEffect(() => {
    VK.init({ apiId: 51686565 });
  }, []);

  useEffect(() => {
    console.log(user);
  }, [user]);

  const handleClick = () => {
    if (!user.id) {
      setLoading(true);
      setAction("Входим...");
      VK.Auth.login((r: VKConnectionType) => {
        console.log(r);
        setUser((prevState) => ({
          ...prevState,
          expire: r.session.expire,
          mid: r.session.mid,
          secret: r.session.secret,
          sid: r.session.sid,
          sig: r.session.sig,
        }));
        VK.Api.call(
          "users.get",
          {
            user_ids: r.session.user.id,
            fields: ["photo_400_orig"],
            v: "5.131",
          },
          (r: { response: UserType[] }) => {
            console.log(r);
            if (r.response) {
              console.log(r);
              setUser((prevState) => ({ ...prevState, ...r.response[0] }));
            }
            setLoading(false);
            setAction(undefined);
          }
        );
      }, 4);
    } else {
      setLoading(true);
      setAction("Выходим...");
      VK.Auth.logout(() => {
        setUser({
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
        setLoading(false);
        setAction(undefined);
      });
    }
  };

  return (
    <>
      <Button
        loading={loading}
        onClick={handleClick}
        loadingAction={action}
        icon={
          user.id ? (
            <div
              className={styles.avatar}
              style={{
                backgroundImage: `url(${user.photo_400_orig})`,
              }}
            ></div>
          ) : (
            <img src={VkLogo} width={20} height={20} alt={"VK Logo"} />
          )
        }
      >
        {user.id && `${user.first_name} ${user.last_name}`}
        {!user.id && "Войти с помощью VK"}
      </Button>
    </>
  );
};

export default VkAuth;
