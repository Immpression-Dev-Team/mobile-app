// utils/notificationFormat.js
export function timeAgo(iso) {
    try {
      const t = new Date(iso).getTime();
      const s = Math.max(0, (Date.now() - t) / 1000);
      if (s < 60) return `${Math.floor(s)}s ago`;
      const m = s / 60;
      if (m < 60) return `${Math.floor(m)}m ago`;
      const h = m / 60;
      if (h < 24) return `${Math.floor(h)}h ago`;
      const d = h / 24;
      if (d < 7) return `${Math.floor(d)}d ago`;
      return new Date(iso).toLocaleDateString();
    } catch {
      return "";
    }
  }
  
  export function formatNotification(n) {
    const actorName =
      n?.actorUserId?.name ||
      n?.actorUserId?.userName ||
      n?.data?.artistName ||
      "Someone";
    const artName = n?.data?.artName || n?.artName || "the artwork";
    const price = n?.data?.price;
    const priceText = Number.isFinite(price) ? `$${(price / 100).toFixed(2)}` : null;
  
    let title = n.title || "";
    let message = n.message || "";
    let icon = "notifications";
    let accent = null;   // "success" | "warning" | null
    let badge = null;    // small label (e.g., "NEW" / "Action needed")
  
    switch (n.type) {
      case "delivery_details_submitted":
        title ||= "New order started";
        message ||= `${actorName} submitted delivery details for “${artName}”.`;
        icon = "assignment-turned-in";
        badge = "NEW";
        break;
  
      case "order_paid":
        title ||= "Payment received";
        message ||= `Payment confirmed for “${artName}”${priceText ? ` (${priceText})` : ""}.`;
        icon = "attach-money";
        accent = "success";
        break;
  
      case "order_needs_shipping":
        title ||= "Action needed: Ship order";
        message ||= `“${artName}” is paid and ready to ship. Add tracking to notify the buyer.`;
        icon = "local-shipping";
        accent = "warning";
        badge = "Action needed";
        break;
  
      case "order_shipped":
        title ||= "Order shipped";
        message ||= `Your “${artName}” has been shipped.`;
        icon = "local-shipping";
        accent = "success";
        break;
  
      case "order_delivered":
        title ||= "Delivered";
        message ||= `“${artName}” was delivered.`;
        icon = "inventory";
        accent = "success";
        break;
  
      case "profile_view":
        title ||= "Profile view";
        message ||= `${actorName} viewed your profile.`;
        icon = "visibility";
        break;
  
      case "like_received":
        title ||= "New like";
        message ||= `${actorName} liked your artwork${artName ? ` “${artName}”` : ""}.`;
        icon = "favorite";
        break;
  
      case "image_approved":
        title ||= "Image approved";
        message ||= `Your image${artName ? ` “${artName}”` : ""} was approved.`;
        icon = "check-circle";
        accent = "success";
        break;
  
      case "image_rejected":
        title ||= "Image rejected";
        message ||= `Your image${artName ? ` “${artName}”` : ""} was rejected.`;
        icon = "error";
        accent = "warning";
        break;
    }
  
    return {
      title,
      message,
      icon,
      accent,
      badge,
      imageUrl: n?.data?.imageLink || null,
      time: timeAgo(n.createdAt),
    };
  }
  