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
} from "@chakra-ui/react";

function App() {
  const [url, setUrl] = useState("");
  const [product, setProduct] = useState(null);
  const [adText, setAdText] = useState("");
  const [adImage, setAdImage] = useState("");
  const [loading, setLoading] = useState(false);

  const toast = useToast(); // for success/error notifications

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
        <Button
          colorScheme="blue"
          onClick={fetchProduct}
          isDisabled={loading}
          minW="120px"
        >
          {loading ? <Spinner size="sm" /> : "Fetch Product"}
        </Button>
      </Flex>

      {/* If product is fetched, display details */}
      {product && (
        <Card
          maxW="600px"
          mx="auto"
          mb={4}
          border="1px"
          borderColor="gray.200"
          borderRadius="md"
        >
          <CardHeader>
            <Heading size="md">{product.title}</Heading>
          </CardHeader>
          <CardBody>
            {product.image_url && (
              <Image
                src={product.image_url}
                alt={product.title}
                maxW="200px"
                mb={4}
              />
            )}
            <Text mb={2}>{product.description}</Text>
            <Text fontWeight="bold">Price: {product.price}</Text>
          </CardBody>
          <CardFooter display="flex" gap={2} flexWrap="wrap">
            <Button
              colorScheme="green"
              onClick={generateAdText}
              isDisabled={loading}
              minW="160px"
            >
              {adText ? "Regenerate Ad Text" : "Generate Ad Text"}
            </Button>
            <Button
              colorScheme="teal"
              onClick={generateAdImage}
              isDisabled={loading}
              minW="160px"
            >
              {adImage ? "Regenerate Ad Image" : "Generate Ad Image"}
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Display Ad Text */}
      {adText && (
        <Box
          maxW="600px"
          mx="auto"
          p={4}
          mt={4}
          border="1px"
          borderColor="gray.200"
          borderRadius="md"
          textAlign="left"
        >
          <Heading size="sm" mb={2}>
            AI-Generated Ad Text
          </Heading>
          <Text>{adText}</Text>
        </Box>
      )}

      {/* Display Ad Image */}
      {adImage && (
        <Box
          maxW="600px"
          mx="auto"
          p={4}
          mt={4}
          border="1px"
          borderColor="gray.200"
          borderRadius="md"
          textAlign="center"
        >
          <Heading size="sm" mb={2}>
            AI-Generated Ad Image
          </Heading>
          <Image src={adImage} alt="Generated Ad" mx="auto" maxW="300px" />
        </Box>
      )}
    </Box>
  );
}

export default App;
