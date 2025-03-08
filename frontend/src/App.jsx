import { useState } from "react";
import axios from "axios";
import {
  Box,
  Heading,
  Text,
  Button,
  Spinner,
  Image,
  Input,
  Flex,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Select,
  Checkbox
} from "@chakra-ui/react";

function App() {
  const [url, setUrl] = useState("");
  const [product, setProduct] = useState(null);
  const [adText, setAdText] = useState("");
  const [adImage, setAdImage] = useState("");
  const [loading, setLoading] = useState(false);

  // State for Publish Ad Modal
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [platform, setPlatform] = useState("facebook");
  const [accountId, setAccountId] = useState("");
  const [includeText, setIncludeText] = useState(true);
  const [includeImage, setIncludeImage] = useState(true);

  const toast = useToast();

  // Fetch Shopify product details
  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/scrape/?url=${encodeURIComponent(url)}`
      );
      console.log("Product Response:", response.data);
      setProduct(response.data);
      toast({
        title: "Product fetched successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error("Fetch Product Error:", err);
      toast({
        title: "Failed to fetch product details.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    setLoading(false);
  };

  // Generate or Regenerate Ad Text
  const generateAdText = async () => {
    if (!product) {
      toast({
        title: "No product details!",
        description: "Please fetch product details first.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:8000/generate_ad/", {
        title: product.title || "Unknown Product",
        description: product.description || "No description available.",
        price: product.price || "N/A",
        refine: adText ? true : false,
      });
      console.log("Ad Text Response:", response.data);
      if (response.data.ad_text) {
        setAdText(response.data.ad_text);
        toast({
          title: adText ? "Ad Text Regenerated!" : "Ad Text Generated!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "No ad text returned.",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (err) {
      console.error("Generate Ad Text Error:", err.response?.data || err);
      toast({
        title: "Failed to generate ad text.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    setLoading(false);
  };

  // Generate or Regenerate Ad Image
  const generateAdImage = async () => {
    if (!product) {
      toast({
        title: "No product details!",
        description: "Please fetch product details first.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:8000/generate_image/", {
        prompt: product.description || "An exciting product",
        refine: adImage ? true : false,
      });
      console.log("Ad Image Response:", response.data);
      if (response.data.image_url) {
        setAdImage(response.data.image_url);
        toast({
          title: adImage ? "Ad Image Regenerated!" : "Ad Image Generated!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "No image URL returned.",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (err) {
      console.error("Generate Ad Image Error:", err.response?.data || err);
      toast({
        title: "Failed to generate ad image.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    setLoading(false);
  };

  // Publish Ad - Calls the new /publish_ad/ endpoint
  const publishAd = async () => {
    if (!product) {
      toast({
        title: "No product details!",
        description: "Fetch product details before publishing.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (!accountId) {
      toast({
        title: "Account ID missing!",
        description: "Please enter your account ID.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:8000/publish_ad/", {
        platform,
        accountId,
        shareText: includeText,
        shareImage: includeImage,
        productLink: url,
        adText,
        adImage,
      });
      console.log("Publish Ad Response:", response.data);
      toast({
        title: "Ad Published Successfully!",
        description: `Posted on ${platform}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setShowPublishModal(false);
    } catch (err) {
      console.error("Publish Ad Error:", err.response?.data || err);
      toast({
        title: "Failed to publish ad.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    setLoading(false);
  };

  return (
    <Box textAlign="center" p={6}>
      <Heading mb={4}>Shopify Product Scraper</Heading>

      {/* URL Input & Fetch Button */}
      <Flex justify="center" gap={2} mb={6}>
        <Input
          placeholder="Enter Shopify product URL (include https://)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          width="400px"
        />
        <Button colorScheme="blue" onClick={fetchProduct} isDisabled={loading} minW="120px">
          {loading ? <Spinner size="sm" /> : "Fetch Product"}
        </Button>
      </Flex>

      {/* If product is fetched, display details */}
      {product && (
        <Card maxW="600px" mx="auto" mb={4} border="1px" borderColor="gray.200" borderRadius="md">
          <CardHeader>
            <Heading size="md">{product.title}</Heading>
          </CardHeader>
          <CardBody>
            {product.image_url && (
              <Image src={product.image_url} alt={product.title} maxW="200px" mb={4} mx="auto" />
            )}
          </CardBody>
          <CardFooter display="flex" gap={2} flexWrap="wrap">
            <Button colorScheme="green" onClick={generateAdText}>
              {adText ? "Regenerate Ad Text" : "Generate Ad Text"}
            </Button>
            <Button colorScheme="teal" onClick={generateAdImage}>
              {adImage ? "Regenerate Ad Image" : "Generate Ad Image"}
            </Button>
            <Button colorScheme="purple" onClick={() => setShowPublishModal(true)}>
              Publish Ad
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Display Ad Text */}
      {adText && (
        <Box maxW="600px" mx="auto" p={4} mt={4} border="1px" borderColor="gray.200" borderRadius="md" textAlign="left">
          <Heading size="sm" mb={2}>AI-Generated Ad Text</Heading>
          <Text>{adText}</Text>
        </Box>
      )}

      {/* Display Ad Image */}
      {adImage && (
        <Box maxW="600px" mx="auto" p={4} mt={4} border="1px" borderColor="gray.200" borderRadius="md" textAlign="center">
          <Heading size="sm" mb={2}>AI-Generated Ad Image</Heading>
          <Image src={adImage} alt="Generated Ad" mx="auto" maxW="300px" />
        </Box>
      )}

      {/* Publish Ad Modal */}
      <Modal isOpen={showPublishModal} onClose={() => setShowPublishModal(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Publish Your Ad</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={3}>
              <FormLabel>Platform</FormLabel>
              <Select value={platform} onChange={(e) => setPlatform(e.target.value)}>
                <option value="facebook">Facebook</option>
                <option value="twitter">Twitter</option>
                <option value="google-ads">Google Ads</option>
              </Select>
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Account ID</FormLabel>
              <Input value={accountId} onChange={(e) => setAccountId(e.target.value)} />
            </FormControl>
            <FormControl mb={3}>
              <Checkbox isChecked={includeText} onChange={(e) => setIncludeText(e.target.checked)}>
                Include Ad Text
              </Checkbox>
            </FormControl>
            <FormControl mb={3}>
              <Checkbox isChecked={includeImage} onChange={(e) => setIncludeImage(e.target.checked)}>
                Include Ad Image
              </Checkbox>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={publishAd} isDisabled={loading}>
              Publish
            </Button>
            <Button onClick={() => setShowPublishModal(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default App;
