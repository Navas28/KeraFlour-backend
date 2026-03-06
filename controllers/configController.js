import MillConfig from "../model/MillConfig.js";

export const getMillConfigs = async (req, res) => {
  try {
    const configs = await MillConfig.find().sort({ date: 1, dayOfWeek: 1 });
    res.json(configs);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching configs", error: error.message });
  }
};

export const createOrUpdateConfig = async (req, res) => {
  try {
    const {
      type,
      dayOfWeek,
      date,
      isClosed,
      openTime,
      closeTime,
      machineType,
      reason,
    } = req.body;

    let config;
    if (type === "weekly_schedule") {
      config = await MillConfig.findOneAndUpdate(
        { type: "weekly_schedule", dayOfWeek },
        { isClosed, openTime, closeTime, machineType, reason },
        { upsert: true, new: true },
      );
    } else {
      config = await MillConfig.findOneAndUpdate(
        { type: "holiday", date },
        { isClosed, openTime, closeTime, machineType, reason },
        { upsert: true, new: true },
      );
    }

    res.json(config);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error saving config", error: error.message });
  }
};

export const deleteConfig = async (req, res) => {
  try {
    await MillConfig.findByIdAndDelete(req.params.id);
    res.json({ message: "Config deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting config", error: error.message });
  }
};
