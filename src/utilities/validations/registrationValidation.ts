export function validateInput(data: any): void {
  const {
    name,
    email,
    mobile,
    password,
    reffered_code,
    driverId,
    aadharID,
    licenseID,
    aadharFrontImage,
    aadharBackImage,
    licenseFrontImage,
    licenseBackImage,
    licenseValidity,
    registrationID,
    model,
    rcFrontImageUrl,
    rcBackImageUrl,
    carFrontImageUrl,
    carBackImageUrl,
    rcStartDate,
    rcExpiryDate,
    latitude,
    longitude,
    driverImageUrl,
    insuranceImageUrl,
    insuranceStartDate,
    insuranceExpiryDate,
    pollutionImageUrl,
    pollutionStartDate,
    pollutionExpiryDate,
    id,
  } = data;

  if (name !== undefined && (typeof name !== 'string' || name.trim().length < 2)) {
    throw new Error('Invalid name: Name must be a string with at least 2 characters');
  }

  if (email !== undefined && (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
    throw new Error('Invalid email: Email must be a valid email address');
  }

  if (mobile !== undefined && (typeof mobile !== 'number' || mobile.toString().length !== 10)) {
    throw new Error('Invalid mobile: Mobile must be a 10-digit number');
  }

  if (password !== undefined && (typeof password !== 'string' || password.length < 6)) {
    throw new Error('Invalid password: Password must be at least 6 characters');
  }

  if (reffered_code !== undefined && (typeof reffered_code !== 'string' || reffered_code.trim().length < 1)) {
    throw new Error('Invalid referral code: Referral code must be a non-empty string');
  }

  if (driverId !== undefined && (typeof driverId !== 'string' || !/^[0-9a-fA-F]{24}$/.test(driverId))) {
    throw new Error('Invalid driverId: Driver ID must be a valid MongoDB ObjectId');
  }

  if (aadharID !== undefined && (typeof aadharID !== 'string' || aadharID.length !== 12)) {
    throw new Error('Invalid Aadhar ID: Aadhar ID must be a 12-digit string');
  }

  if (licenseID !== undefined && (typeof licenseID !== 'string' || licenseID.trim().length < 1)) {
    throw new Error('Invalid license ID: License ID must be a non-empty string');
  }

  if (aadharFrontImage !== undefined && (typeof aadharFrontImage !== 'string' || !isValidUrl(aadharFrontImage))) {
    throw new Error('Invalid Aadhar front image: Must be a valid URL');
  }

  if (aadharBackImage !== undefined && (typeof aadharBackImage !== 'string' || !isValidUrl(aadharBackImage))) {
    throw new Error('Invalid Aadhar back image: Must be a valid URL');
  }

  if (licenseFrontImage !== undefined && (typeof licenseFrontImage !== 'string' || !isValidUrl(licenseFrontImage))) {
    throw new Error('Invalid license front image: Must be a valid URL');
  }

  if (licenseBackImage !== undefined && (typeof licenseBackImage !== 'string' || !isValidUrl(licenseBackImage))) {
    throw new Error('Invalid license back image: Must be a valid URL');
  }

  if (licenseValidity !== undefined && (typeof licenseValidity !== 'string' || isNaN(Date.parse(licenseValidity)))) {
    throw new Error('Invalid license validity: Must be a valid date string');
  }

  if (registrationID !== undefined && (typeof registrationID !== 'string' || registrationID.trim().length < 1)) {
    throw new Error('Invalid registration ID: Registration ID must be a non-empty string');
  }

  if (model !== undefined && (typeof model !== 'string' || model.trim().length < 1)) {
    throw new Error('Invalid model: Model must be a non-empty string');
  }

  if (rcFrontImageUrl !== undefined && (typeof rcFrontImageUrl !== 'string' || !isValidUrl(rcFrontImageUrl))) {
    throw new Error('Invalid RC front image: Must be a valid URL');
  }

  if (rcBackImageUrl !== undefined && (typeof rcBackImageUrl !== 'string' || !isValidUrl(rcBackImageUrl))) {
    throw new Error('Invalid RC back image: Must be a valid URL');
  }

  if (carFrontImageUrl !== undefined && (typeof carFrontImageUrl !== 'string' || isValidUrl(carFrontImageUrl))) {
    throw new Error('Invalid car front image: Must be a valid URL');
  }

  if (carBackImageUrl !== undefined && (typeof carBackImageUrl !== 'string' || !isValidUrl(carBackImageUrl))) {
    throw new Error('Invalid car back image: Must be a valid URL');
  }

  if (rcStartDate !== undefined && (typeof rcStartDate !== 'string' || isNaN(Date.parse(rcStartDate)))) {
    throw new Error('Invalid RC start date: Must be a valid date string');
  }

  if (rcExpiryDate !== undefined && (typeof rcExpiryDate !== 'string' || isNaN(Date.parse(rcExpiryDate)))) {
    throw new Error('Invalid RC expiry date: Must be a valid date string');
  }

  if (latitude !== undefined && (typeof latitude !== 'number' || latitude < -90 || latitude > 90)) {
    throw new Error('Invalid latitude: Latitude must be a number between -90 and 90');
  }

  if (longitude !== undefined && (typeof longitude !== 'number' || longitude < -180 || longitude > 180)) {
    throw new Error('Invalid longitude: Longitude must be a number between -180 and 180');
  }

  if (driverImageUrl !== undefined && (typeof driverImageUrl !== 'string' || !isValidUrl(driverImageUrl))) {
    throw new Error('Invalid driver image URL: Must be a valid URL');
  }

  if (insuranceImageUrl !== undefined && (typeof insuranceImageUrl !== 'string' || !isValidUrl(insuranceImageUrl))) {
    throw new Error('Invalid insurance image URL: Must be a valid URL');
  }

  if (insuranceStartDate !== undefined && (typeof insuranceStartDate !== 'string' || isNaN(Date.parse(insuranceStartDate)))) {
    throw new Error('Invalid insurance start date: Must be a valid date string');
  }

  if (insuranceExpiryDate !== undefined && (typeof insuranceExpiryDate !== 'string' || isNaN(Date.parse(insuranceExpiryDate)))) {
    throw new Error('Invalid insurance expiry date: Must be a valid date string');
  }

  if (pollutionImageUrl !== undefined && (typeof pollutionImageUrl !== 'string' || !isValidUrl(pollutionImageUrl))) {
    throw new Error('Invalid pollution image URL: Must be a valid URL');
  }

  if (pollutionStartDate !== undefined && (typeof pollutionStartDate !== 'string' || isNaN(Date.parse(pollutionStartDate)))) {
    throw new Error('Invalid pollution start date: Must be a valid date string');
  }

  if (pollutionExpiryDate !== undefined && (typeof pollutionExpiryDate !== 'string' || isNaN(Date.parse(pollutionExpiryDate)))) {
    throw new Error('Invalid pollution expiry date: Must be a valid date string');
  }

  if (id !== undefined && (typeof id !== 'string' || !/^[0-9a-fA-F]{24}$/.test(id))) {
    throw new Error('Invalid ID: ID must be a valid MongoDB ObjectId');
  }
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}