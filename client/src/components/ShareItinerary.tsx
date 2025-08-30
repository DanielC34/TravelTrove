import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Share2,
  Copy,
  Mail,
  MessageCircle,
  Twitter,
  Facebook,
  Instagram,
  Link,
  Check,
  X,
} from "lucide-react";
import { toast } from "sonner";

interface ShareItineraryProps {
  tripId: string;
  tripName: string;
  destination: string;
  isPublic: boolean;
  onTogglePublic: (isPublic: boolean) => void;
  onClose: () => void;
}

export function ShareItinerary({
  tripId,
  tripName,
  destination,
  isPublic,
  onTogglePublic,
  onClose,
}: ShareItineraryProps) {
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState("");

  const shareUrl = `${window.location.origin}/trips/${tripId}`;
  const shareText = `Check out my trip to ${destination}: ${tripName}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  const handleEmailShare = () => {
    if (!email) {
      toast.error("Please enter an email address");
      return;
    }

    const subject = encodeURIComponent(`Check out my trip to ${destination}`);
    const body = encodeURIComponent(
      `Hi!\n\nI wanted to share my trip itinerary with you:\n\n${tripName}\nDestination: ${destination}\n\nView the full itinerary here: ${shareUrl}\n\nHappy travels!`
    );

    window.open(`mailto:${email}?subject=${subject}&body=${body}`);
    toast.success("Email client opened!");
  };

  const handleSocialShare = (platform: string) => {
    let url = "";

    switch (platform) {
      case "twitter":
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          shareText
        )}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          shareUrl
        )}`;
        break;
      case "whatsapp":
        url = `https://wa.me/?text=${encodeURIComponent(
          `${shareText} ${shareUrl}`
        )}`;
        break;
      default:
        return;
    }

    window.open(url, "_blank");
    toast.success(`Shared on ${platform}!`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Share Itinerary</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {/* Public/Private Toggle */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Visibility</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {isPublic ? "Public" : "Private"}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onTogglePublic(!isPublic)}
                >
                  {isPublic ? "Make Private" : "Make Public"}
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {isPublic
                  ? "Anyone with the link can view your itinerary"
                  : "Only you can view this itinerary"}
              </p>
            </CardContent>
          </Card>

          {/* Share Link */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Share Link</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Input value={shareUrl} readOnly className="flex-1" />
                <Button variant="outline" size="sm" onClick={handleCopyLink}>
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Email Share */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Share via Email
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Input
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                />
                <Button variant="outline" size="sm" onClick={handleEmailShare}>
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Social Media Share */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Share on Social Media
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSocialShare("twitter")}
                  className="flex items-center space-x-1"
                >
                  <Twitter className="h-4 w-4" />
                  <span className="text-xs">Twitter</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSocialShare("facebook")}
                  className="flex items-center space-x-1"
                >
                  <Facebook className="h-4 w-4" />
                  <span className="text-xs">Facebook</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSocialShare("whatsapp")}
                  className="flex items-center space-x-1"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-xs">WhatsApp</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Trip Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Trip Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium">Trip:</span>
                  <span className="text-sm text-gray-600 ml-2">{tripName}</span>
                </div>
                <div>
                  <span className="text-sm font-medium">Destination:</span>
                  <span className="text-sm text-gray-600 ml-2">
                    {destination}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium">Status:</span>
                  <Badge
                    variant={isPublic ? "default" : "secondary"}
                    className="ml-2"
                  >
                    {isPublic ? "Public" : "Private"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
