// src/components/Login.tsx
import { type JSX, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Form,
  Input,
  Space,
  Typography,
} from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import type { SendingConvertedUser } from "./types/ConvertedUser.ts";
import { useAuth } from "./Context/AuthContext.tsx";

const { Title } = Typography;

type LoginFormValues = {
  username: string;
  password: string;
  remember: boolean;
};

export default function Login(): JSX.Element {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user, login } = useAuth();
  if (user) {
    return (
      <Navigate to={`/user/${encodeURIComponent(user.displayname)}`} replace />
    );
  }

  const onFinish = async (values: LoginFormValues) => {
    setErrorMsg(null);
    setLoading(true);
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      const data: SendingConvertedUser = {
        credentials: values.username + ":" + values.password,
      };
      const res = await fetch(import.meta.env.VITE_APIURL + "/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // wichtig, wenn Server HttpOnly-Cookies setzt
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (res.ok) {
        // Optional: parse response body wenn nötig
        // const data = await res.json();

        if (values.remember) {
          localStorage.setItem("rememberedUsername", values.username);
        } else {
          localStorage.removeItem("rememberedUsername");
        }
        login();
        navigate("/");
        return;
      }

      // Fehler: versuche aussagekräftige Nachricht zu extrahieren
      let msg = "Anmeldung fehlgeschlagen. Bitte überprüfen Sie Ihre Eingaben.";
      try {
        const errBody = await res.json();
        if (errBody?.message) msg = errBody.message;
      } catch {
        // keine JSON-Antwort
      }
      setErrorMsg(msg);
    } catch (err: unknown) {
      if ((err instanceof Error)) {
        if (err.name === "AbortError") {
          setErrorMsg("Server reagiert nicht. Bitte wiederholen.");
        } else {
          setErrorMsg(
            "Anmeldung fehlgeschlagen. Bitte überprüfen Sie Ihre Eingaben.",
          );
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const remembered = localStorage.getItem("rememberedUsername") || "";

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
        background: "#f0f2f5",
        padding: 16,
      }}
    >
      <Card style={{ width: 420, boxShadow: "0 2px 8px rgba(0,0,0,0.09)" }}>
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Title level={3} style={{ margin: 0, textAlign: "center" }}>
            Anmelden
          </Title>

          {errorMsg && <Alert type="error" message={errorMsg} showIcon />}

          <Form
            name="login_form"
            initialValues={{
              username: remembered,
              remember: Boolean(remembered),
            }}
            onFinish={onFinish}
            layout="vertical"
          >
            <Form.Item
              label="Benutzername oder E-Mail"
              name="username"
              rules={[
                {
                  required: true,
                  message: "Bitte Benutzername oder E‑Mail eingeben",
                },
                { min: 3, message: "Mindestens 3 Zeichen" },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Benutzername oder E‑Mail"
                autoComplete="username"
              />
            </Form.Item>

            <Form.Item
              label="Passwort"
              name="password"
              rules={[{ required: true, message: "Bitte Passwort eingeben" }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Passwort"
                autoComplete="current-password"
              />
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Angemeldet bleiben</Checkbox>
            </Form.Item>

            <Form.Item style={{ marginTop: 16 }}>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
                size="large"
              >
                Anmelden
              </Button>
            </Form.Item>

            <Form.Item style={{ textAlign: "center", marginBottom: 0 }}>
              <Space direction="vertical" size="small">
                <Button
                  type="link"
                  onClick={() => navigate("/forgot-password")}
                >
                  Passwort vergessen?
                </Button>
                <Button type="link" onClick={() => navigate("/Register")}>
                  Noch keinen Account? Registrieren
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Space>
      </Card>
    </div>
  );
}
