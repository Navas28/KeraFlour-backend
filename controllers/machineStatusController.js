import MachineStatus from "../model/MachineStatus.js";
import MillConfig from "../model/MillConfig.js";
import Product from "../model/Product.js";

export const getMachineStatuses = async (req, res) => {
  try {
    const statuses = await MachineStatus.find();
    const types = ["grain", "spice"];
    const results = types.map((type) => {
      const found = statuses.find((s) => s.machineType === type);
      return found || { machineType: type, status: "free", message: "" };
    });
    res.json(results);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching machine statuses",
      error: error.message,
    });
  }
};

export const updateMachineStatus = async (req, res) => {
  try {
    const { machineType, status, message } = req.body;

    const updatedStatus = await MachineStatus.findOneAndUpdate(
      { machineType },
      { status, message, lastUpdated: Date.now() },
      { upsert: true, new: true },
    );

    res.json(updatedStatus);
  } catch (error) {
    res.status(400).json({
      message: "Error updating machine status",
      error: error.message,
    });
  }
};

export const getMillAvailability = async (req, res) => {
  try {
    let { date, productId } = req.query;

    if (!date) {
      date = new Date().toISOString().split("T")[0];
    }

    let machineType = "both";
    if (productId) {
      const product = await Product.findById(productId);
      if (product) machineType = product.machineType;
    }

    const dayOfWeek = new Date(date).getDay();
    const holiday = await MillConfig.findOne({ type: "holiday", date });
    const schedule = await MillConfig.findOne({
      type: "weekly_schedule",
      dayOfWeek,
    });

    let isClosed = false;
    let closedReason = "";

    if (holiday) {
      if (
        holiday.isClosed &&
        (holiday.machineType === "both" || holiday.machineType === machineType)
      ) {
        isClosed = true;
        closedReason =
          holiday.reason || "The mill is closed for holiday/maintenance.";
      }
    } else if (schedule) {
      if (
        schedule.isClosed &&
        (schedule.machineType === "both" ||
          schedule.machineType === machineType)
      ) {
        isClosed = true;
        closedReason = schedule.reason || "The mill is closed today.";
      }
    }

    res.json({
      date,
      isClosed,
      message: closedReason,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error checking mill availability",
      error: error.message,
    });
  }
};
