import { pricing } from "./pricing"


export const isPeakHour = () => {

  const currentHour = new Date().getHours()

  const start = pricing.peakHours.start
  const end = pricing.peakHours.end


  if (start > end) {
    return currentHour >= start || currentHour < end
  }


  return currentHour >= start && currentHour < end
}


export const calculateSessionPrice = (
  stationType,
  duration
) => {

  const peak = isPeakHour()

  const pricingType = peak
    ? "peak"
    : "offPeak"


  return pricing[
    stationType
  ][pricingType][duration]
}