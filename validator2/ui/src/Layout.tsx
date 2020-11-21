import React, { useState } from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import dappnodeLogo from "img/dappnode-logo.png";
import { makeStyles } from "@material-ui/core/styles";
import {
  Drawer,
  Box,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  Container,
  Grid,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  SvgIconTypeMap,
} from "@material-ui/core";
import { OverridableComponent } from "@material-ui/core/OverridableComponent";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Brightness7Icon from "@material-ui/icons/Brightness7";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import HomeIcon from "@material-ui/icons/Home";
import BackupIcon from "@material-ui/icons/Backup";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import PeopleIcon from "@material-ui/icons/People";
import BarChartIcon from "@material-ui/icons/BarChart";
import LayersIcon from "@material-ui/icons/Layers";
import AssignmentIcon from "@material-ui/icons/Assignment";
import { FooterNote } from "./components/FooterNote";
import { paths } from "paths";
import { newTabProps, noAStyle } from "utils";

const sideNavMainItems = [
  {
    name: "Dashboard",
    Icon: HomeIcon,
    path: paths.home,
  },
  {
    name: "Import",
    Icon: BackupIcon,
    path: paths.validatorsImport,
  },
  {
    name: "Export",
    Icon: CloudDownloadIcon,
    path: paths.validatorsExport,
  },
];

export const sideNameSecondaryItems = [
  {
    name: "Metrics",
    Icon: BarChartIcon,
    href: "http://dms.dappnode/d/DNPE2PAD/dappnode-eth-2-0-medalla-dashboard",
  },
  {
    name: "Nodes",
    Icon: LayersIcon,
    href: "https://eth2stats.io/medalla-testnet",
  },
  {
    name: "Logs",
    Icon: AssignmentIcon,
    href:
      "http://my.dappnode/#/packages/medalla-validator.dnp.dappnode.eth/logs",
  },
  {
    name: "Support",
    Icon: PeopleIcon,
    href: "https://riot.im/app/#/room/#DAppNode:matrix.org",
  },
];

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
    display: "grid",
    // Force second item (title) to collapse on small screens
    gridTemplateColumns: "min-content minmax(0, auto) repeat(10, min-content)",
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar,
  },
  topBarLogo: {
    height: "30px",
    marginRight: "10px",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: "none",
  },
  mainLogo: {
    color: "inherit",
    textDecoration: "none",
    display: "flex",
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
    display: "flex",
    flexDirection: "column",
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    flex: "auto",
    display: "flex",
    flexDirection: "column",
  },
  footer: {
    flex: "auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
}));

export const Layout: React.FC<{
  darkMode?: boolean;
  switchDark: () => void;
  logout: () => void;
}> = ({ logout, darkMode, switchDark, children }) => {
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const classes = useStyles();

  return (
    <div className={classes.root}>
      {/* Top nav bar */}
      <AppBar
        elevation={2}
        position="absolute"
        color="inherit"
        className={clsx(classes.appBar, open && classes.appBarShift)}
      >
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(
              classes.menuButton,
              open && classes.menuButtonHidden
            )}
          >
            <MenuIcon />
          </IconButton>

          <Link to={paths.home} className={classes.mainLogo}>
            <img src={dappnodeLogo} className={classes.topBarLogo} alt="logo" />
            <Typography component="h1" variant="h6" color="inherit" noWrap>
              Prysm Medalla validator
            </Typography>
          </Link>

          <IconButton color="inherit" onClick={switchDark}>
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>

          {/* <IconButton color="inherit">
            <Badge badgeContent={4} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton> */}

          <IconButton color="inherit" onClick={logout}>
            <ExitToAppIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Side nav bar */}
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          <div>{ListItems(sideNavMainItems)}</div>
        </List>
        <Divider />
        <List>
          <div>
            <ListSubheader inset>Help</ListSubheader>
            {ListItems(sideNameSecondaryItems)}
          </div>
        </List>
      </Drawer>

      {/* Main content */}
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            {children}
          </Grid>
          <Box pt={4} className={classes.footer}>
            <FooterNote />
          </Box>
        </Container>
      </main>
    </div>
  );
};

function ListItems(
  items: {
    name: string;
    Icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
    href?: string;
    path?: string;
  }[]
) {
  return items.map(({ name, Icon, href, path }) =>
    href ? (
      <ListItem key={name} button component="a" href={href} {...newTabProps}>
        <ListItemIcon>
          <Icon />
        </ListItemIcon>
        <ListItemText primary={name} />
      </ListItem>
    ) : path ? (
      <Link key={name} to={path} style={noAStyle}>
        <ListItem button>
          <ListItemIcon>
            <Icon />
          </ListItemIcon>
          <ListItemText primary={name} />
        </ListItem>
      </Link>
    ) : null
  );
}
