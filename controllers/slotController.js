import Order from "../model/Order.js";
import Product from "../model/Product.js";
import MillConfig from "../model/MillConfig.js";

const DEFAULT_WORKING_HOURS = {
  start: 10,
  end: 18,
};

const SLOT_DURATION_MINS = 60;

export const getAvailableSlots = async (req, res) => {
  try {
    const { date, productId, quantity } = req.query;

    if (!date || !productId || !quantity) {
      return res
        .status(400)
        .json({ message: "Date, productId, and quantity are required" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const requiredMinutes = product.grindingTimePerKg * quantity;
    const machineType = product.machineType;

    const dayOfWeek = new Date(date).getDay();

    const holiday = await MillConfig.findOne({ type: "holiday", date });

    const schedule = await MillConfig.findOne({
      type: "weekly_schedule",
      dayOfWeek,
    });

    let workingHours = { ...DEFAULT_WORKING_HOURS };
    let isClosed = false;
    let closedReason = "";
    if (holiday) {
      if (
        holiday.isClosed &&
        (holiday.machineType === "both" || holiday.machineType === machineType)
      ) {
        isClosed = true;
        closedReason = holiday.reason || "Closed for holiday/maintenance";
      } else {
        workingHours.start = parseInt(holiday.openTime.split(":")[0]);
        workingHours.end = parseInt(holiday.closeTime.split(":")[0]);
      }
    } else if (schedule) {
      if (
        schedule.isClosed &&
        (schedule.machineType === "both" ||
          schedule.machineType === machineType)
      ) {
        isClosed = true;
        closedReason = schedule.reason || "Closed today";
      } else {
        workingHours.start = parseInt(schedule.openTime.split(":")[0]);
        workingHours.end = parseInt(schedule.closeTime.split(":")[0]);
      }
    }

    if (isClosed) {
      return res.json({
        date,
        isClosed: true,
        message: closedReason,
        slots: [],
      });
    }

    const slots = [];
    for (let hour = workingHours.start; hour < workingHours.end; hour++) {
      const label = `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? "PM" : "AM"} - ${hour + 1 > 12 ? hour + 1 - 12 : hour + 1}:00 ${hour + 1 >= 12 ? "PM" : "AM"}`;
      slots.push({ time: label, hour });
    }

    const existingOrders = await Order.find({
      slotDate: date,
      machineType: machineType,
      status: { $ne: "cancelled" },
    });

    const availability = slots.map((slot) => {
      const usedMinutes = existingOrders
        .filter((order) => order.slotTime === slot.time)
        .reduce((sum, order) => sum + (order.estimatedMinutes || 0), 0);

      const remainingMinutes = SLOT_DURATION_MINS - usedMinutes;
      const isAvailable = remainingMinutes >= requiredMinutes;

      return {
        ...slot,
        usedMinutes,
        remainingMinutes,
        isAvailable,
        capacityPercent: Math.min(
          100,
          Math.round((usedMinutes / SLOT_DURATION_MINS) * 100),
        ),
      };
    });

    res.json({
      date,
      machineType,
      requiredMinutes,
      isClosed: false,
      slots: availability,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching slots", error: error.message });
  }
};
