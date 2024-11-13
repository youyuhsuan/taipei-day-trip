// variables
import "./variables.js";

// api
import { bookingGetApi } from "./api/bookingGetApi.js";
import "./api/bookingDeleteApi.js";
import "./api/ordersPostApi.js";
import "./api/userAuthGetApi.js";

// components
import "./components/bookingBtn.js";
import "./components/orderForm.js";
import "./components/tappay.js";

// events
import "./events/initFooterMonitor.js";

bookingGetApi();
