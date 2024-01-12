import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text
} from "@react-email/components"
import * as React from "react"

interface LinearLoginCodeEmailProps {}

const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000"

const RegularizeEmail = ({}: LinearLoginCodeEmailProps) => (
  <Html>
    <Head lang="pt-br" />
    <Preview>Regularize sua conta!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src={`${baseUrl}/static/logo.png`}
          width="90"
          height="40"
          alt="Linear"
          style={logo}
        />
        <Heading style={heading}>Regularize sua conta!</Heading>
        <Text style={paragraph}>
          Detectamos que o pagamento da sua conta não está regularizado. Para continuar usando o ZapDiviser, regularize o pagamento da sua conta.
        </Text>
        <Hr style={hr} />
        <Link href="https://linear.app" style={reportLink}>
          Em caso de dúvidas, entre em contato conosco
        </Link>
      </Container>
    </Body>
  </Html>
)

export default RegularizeEmail

const logo = {
  borderRadius: 21,
  width: 180,
  height: 60,
  background: "#16a34a",
  padding: "10px"
}

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    "-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,Oxygen-Sans,Ubuntu,Cantarell,\"Helvetica Neue\",sans-serif"
}

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "560px"
}

const heading = {
  fontSize: "24px",
  letterSpacing: "-0.5px",
  lineHeight: "1.3",
  fontWeight: "400",
  color: "#484848",
  padding: "17px 0 0"
}

const paragraph = {
  margin: "0 0 15px",
  fontSize: "15px",
  lineHeight: "1.4",
  color: "#3c4149"
}

const buttonContainer = {
  padding: "27px 0 27px"
}

const button = {
  background: "linear-gradient(90deg, #16a34a, #22c55e)",
  borderRadius: "3px",
  fontWeight: "600",
  color: "#fff",
  fontSize: "15px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px 24px"
}

const reportLink = {
  fontSize: "14px",
  color: "#b4becc"
}

const hr = {
  borderColor: "#dfe1e4",
  margin: "42px 0 26px"
}

const code = {
  fontFamily: "monospace",
  fontWeight: "700",
  padding: "1px 4px",
  backgroundColor: "#dfe1e4",
  letterSpacing: "-0.3px",
  fontSize: "21px",
  borderRadius: "4px",
  color: "#3c4149"
}
