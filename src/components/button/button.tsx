import React, { FC, ReactNode, useEffect, useState } from "react";
import styles from "./Button.module.css";
import VkLogo from "../../static/vk_logo.svg";

const Spinner: FC = () => {
  return (
    <svg
      className={`${styles.spinner} ${styles.accent}`}
      viewBox="0 0 50 50"
      width="24"
      height="24"
    >
      <circle
        className={styles.accent}
        cx="25"
        cy="25"
        r="20"
        fill="none"
        strokeWidth="4"
        stroke="#fff"
      ></circle>
    </svg>
  );
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingAction?: string;
  icon?: ReactNode;
}

export const Button: FC<ButtonProps> = ({
  loading = false,
  loadingAction = "Загрузка...",
  onClick,
  icon,
  children,
  disabled,
  ...props
}) => {
  return (
    <button
      className={`${styles.button} ${loading ? styles.loading : ""}`}
      disabled={loading || disabled}
      onClick={onClick}
      {...props}
    >
      {!loading && (
        <>
          {icon && <div className={styles.icon}>{icon}</div>}
          <span className={styles.text}>{children}</span>
        </>
      )}
      {loading && (
        <>
          <div>
            <Spinner />
          </div>
          <span className={`${styles.text} ${styles.loading}`}>
            {loadingAction}
          </span>
        </>
      )}
    </button>
  );
};

export default Button;
