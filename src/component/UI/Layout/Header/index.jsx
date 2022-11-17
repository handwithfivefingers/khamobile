import CogIcon from "@rsuite/icons/legacy/Cog";
import HomeIcon from "@rsuite/icons/legacy/Home";
import { Badge, Nav, Navbar } from "rsuite";

import LOGO from "assets/img/logo.png";
import Image from "next/image";
import Link from "next/link";
import styles from "./styles.module.scss";
import { useEffect } from "react";
import { useState } from "react";
const CustomNavbar = ({ onSelect, activeKey, ...props }) => {
  const [cartLength, setCartLength] = useState(null);
  useEffect(() => {
    let item = JSON.parse(localStorage.getItem("khaMobileCart"));

    if (item) {
      setCartLength(item.length);
    }
  }, []);

  return (
    <Navbar {...props} className={styles.nav}>
      <Navbar.Brand className={styles.brand} href="#" style={{ maxWidth: 200 }}>
        <Image src={LOGO} alt="Kha mobile" priority />
      </Navbar.Brand>
      <Nav onSelect={onSelect} activeKey={activeKey}>
        <Nav.Item eventKey="1" icon={<HomeIcon />}>
          Home
        </Nav.Item>

        <Link href="/about-us" passHref>
          <Nav.Item eventKey="2">About us</Nav.Item>
        </Link>

        <Link href="/product" passHref>
          <Nav.Item eventKey="3">Products</Nav.Item>
        </Link>

        <Link href="/category" passHref>
          <Nav.Item eventKey="4">Danh mục</Nav.Item>
        </Link>

        <Link href="/tin-tuc" passHref>
          <Nav.Item eventKey="5">Tin tức</Nav.Item>
        </Link>

        <Nav.Menu title="About">
          <Nav.Item eventKey="6">Company</Nav.Item>
          <Nav.Item eventKey="7">Team</Nav.Item>
          <Nav.Item eventKey="8">Contact</Nav.Item>
        </Nav.Menu>
      </Nav>
      <Nav pullRight>
        <Link href="/cart" passHref>
          <Nav.Item icon={<CogIcon />} eventKey="7">
            <Badge content={cartLength}>Giỏ hàng</Badge>
          </Nav.Item>
        </Link>
        <Link href="/admin" passHref>
          <Nav.Item icon={<CogIcon />} eventKey="7">
            Admin
          </Nav.Item>
        </Link>
      </Nav>
    </Navbar>
  );
};
export default CustomNavbar;

CustomNavbar.defaultProps = {};
