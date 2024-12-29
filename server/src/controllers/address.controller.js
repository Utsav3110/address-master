import Address from '../models/address.model.js';

// Get all addresses for a user
export const getUserAddresses = async (req, res) => {
  try {
    const { _id } = req.user._id;
    const addresses = await Address.find({ userId: _id });
    res.status(200).json(addresses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching addresses', error });
  }
};

// Add a new address
export const addAddress = async (req, res) => {
  try {
    const { _id } = req.user._id;
    const { address, addressType, coordinates } = req.body;

    console.log(address, addressType, coordinates);

    const addresstype = addressType.toLowerCase();

    // Create a new address document
    const newAddress = new Address({
      userId: _id,
      address,
      addressType: addresstype,
      coordinates,
    });

    await newAddress.save();
    res.status(201).json(newAddress);
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ message: 'Error adding address', error: error.message });
  }
};

// Delete an address
export const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;

    // Find and delete the address by ID
    const deletedAddress = await Address.findByIdAndDelete(addressId);

    if (!deletedAddress) {
      return res.status(404).json({ message: 'Address not found' });
    }

    res.status(200).json({ message: 'Address deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting address', error });
  }
};

export const search = async (req, res) => {
  const { amenity, street, city } = req.query;

  // Log incoming query parameters
  console.log('Query Params:', { amenity, street, city });

  // Build query string for OpenStreetMap
  const queryParts = [];
  if (street) queryParts.push(`street=${encodeURIComponent(street)}`);
  if (city) queryParts.push(`city=${encodeURIComponent(city)}`);
  if (amenity) queryParts.push(`amenity=${encodeURIComponent(amenity)}`);

  const queryString = queryParts.join('&');
  const osmURL = `https://nominatim.openstreetmap.org/search?format=json&${queryString}`;

  try {
    console.log('Requesting URL:', osmURL);

    const response = await fetch(osmURL);
    const data = await response.json();

    console.log('OSM Response:', data);

    // Send response back to client
    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  }
};
