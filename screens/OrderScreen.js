import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import ScreenTemplate from "./Template/ScreenTemplate";
import { useAuth } from "../state/AuthProvider";
import { getMyOrders } from "../API/API";

export default function OrderScreen({ navigation }) {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('buyer');
  const [selectedStatus, setSelectedStatus] = useState(null); // null shows dashboard, status shows specific section
  const [selectedSellerStatus, setSelectedSellerStatus] = useState(null); // null shows seller dashboard, status shows specific section
  
  // Real orders data
  const [buyerOrders, setBuyerOrders] = useState([]);
  const [sellerOrders, setSellerOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch orders from API
  const fetchOrders = async () => {
    if (!token) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await getMyOrders(token);
      console.log('Orders API Response:', response);
      
      if (response.success && response.data) {
        // Separate buyer and seller orders based on order type/role
        const buyerOrdersList = [];
        const sellerOrdersList = [];
        
        response.data.forEach(order => {
          // Determine if this is a buyer order or seller order
          // You may need to adjust this logic based on your backend data structure
          if (order.orderType === 'purchase' || order.role === 'buyer') {
            buyerOrdersList.push({
              id: order._id || order.id,
              artworkTitle: order.artworkTitle || order.artName || 'Artwork',
              artistName: order.artistName || 'Unknown Artist',
              price: order.price || order.totalAmount || 0,
              orderDate: order.createdAt || order.orderDate,
              status: mapOrderStatus(order.status, 'buyer'),
              imageUrl: order.imageUrl || order.imageLink || null,
              trackingNumber: order.trackingNumber || null,
              deliveryDate: order.deliveryDate || null,
              shippedDate: order.shippedDate || null,
              estimatedShipping: order.estimatedShipping || null
            });
          } else {
            // Seller order
            sellerOrdersList.push({
              id: order._id || order.id,
              artworkTitle: order.artworkTitle || order.artName || 'Artwork',
              buyerName: order.buyerName || order.customerName || 'Customer',
              price: order.price || order.totalAmount || 0,
              saleDate: order.createdAt || order.orderDate,
              status: mapOrderStatus(order.status, 'seller'),
              imageUrl: order.imageUrl || order.imageLink || null,
              commission: order.commission || (order.price * 0.1) || 0, // 10% default commission
              trackingNumber: order.trackingNumber || null
            });
          }
        });
        
        setBuyerOrders(buyerOrdersList);
        setSellerOrders(sellerOrdersList);
      } else {
        console.log('No orders found or API error');
        setBuyerOrders([]);
        setSellerOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError(error.message);
      setBuyerOrders([]);
      setSellerOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Map backend status to frontend status
  const mapOrderStatus = (backendStatus, role) => {
    if (!backendStatus) return role === 'buyer' ? 'ordered' : 'processing';
    
    const status = backendStatus.toLowerCase();
    
    if (role === 'buyer') {
      // Buyer statuses: ordered, shipped, delivered
      if (status.includes('delivered') || status.includes('completed')) return 'delivered';
      if (status.includes('shipped') || status.includes('transit')) return 'shipped';
      return 'ordered';
    } else {
      // Seller statuses: processing, shipped, delivered
      if (status.includes('delivered') || status.includes('completed')) return 'delivered';
      if (status.includes('shipped') || status.includes('transit')) return 'shipped';
      return 'processing';
    }
  };

  // Fetch orders on component mount and when token changes
  useEffect(() => {
    fetchOrders();
  }, [token]);

  // Refresh orders when tab changes or when returning from tracking screen
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchOrders();
    });
    return unsubscribe;
  }, [navigation]);

  // Sample data for buyer orders (purchases) - COMMENTED OUT FOR REAL DATA
  const sampleBuyerOrders = [
    // // Delivered Orders
    // {
    //   id: 'B001',
    //   artworkTitle: 'Sunset Dreams',
    //   artistName: 'Sarah Johnson',
    //   price: 125.00,
    //   orderDate: '2024-01-15',
    //   status: 'delivered',
    //   imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=300&fit=crop',
    //   trackingNumber: 'TRK123456789',
    //   deliveryDate: '2024-01-22'
    // },
    // {
    //   id: 'B004',
    //   artworkTitle: 'Ocean Waves',
    //   artistName: 'Maria Garcia',
    //   price: 95.00,
    //   orderDate: '2024-01-10',
    //   status: 'delivered',
    //   imageUrl: 'https://images.unsplash.com/photo-1544967882-7a8e72c2ae37?w=300&h=300&fit=crop',
    //   trackingNumber: 'TRK555666777',
    //   deliveryDate: '2024-01-18'
    // },
    // // Shipped Orders
    // {
    //   id: 'B002',
    //   artworkTitle: 'Urban Abstract',
    //   artistName: 'Mike Chen',
    //   price: 89.50,
    //   orderDate: '2024-01-20',
    //   status: 'shipped',
    //   imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop',
    //   trackingNumber: 'TRK987654321',
    //   shippedDate: '2024-01-22'
    // },
    // // Ordered (Confirmed)
    // {
    //   id: 'B003',
    //   artworkTitle: 'Nature\'s Whisper',
    //   artistName: 'Emily Rose',
    //   price: 200.00,
    //   orderDate: '2024-01-25',
    //   status: 'ordered',
    //   imageUrl: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=300&h=300&fit=crop',
    //   trackingNumber: null,
    //   estimatedShipping: '2024-01-30'
    // },
    // {
    //   id: 'B005',
    //   artworkTitle: 'Mountain Peak',
    //   artistName: 'David Park',
    //   price: 175.00,
    //   orderDate: '2024-01-26',
    //   status: 'ordered',
    //   imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop',
    //   trackingNumber: null,
    //   estimatedShipping: '2024-01-31'
    // }
  ];

  // Sample data for seller orders (sales) - COMMENTED OUT FOR REAL DATA
  const sampleSellerOrders = [
    // {
    //   id: 'S001',
    //   artworkTitle: 'Digital Horizon',
    //   buyerName: 'Alex Thompson',
    //   price: 150.00,
    //   saleDate: '2024-01-10',
    //   status: 'delivered',
    //   imageUrl: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=300&h=300&fit=crop',
    //   commission: 15.00
    // },
    // {
    //   id: 'S002',
    //   artworkTitle: 'Midnight Blues',
    //   buyerName: 'Jessica Park',
    //   price: 75.00,
    //   saleDate: '2024-01-18',
    //   status: 'shipped',
    //   imageUrl: 'https://images.unsplash.com/photo-1549289524-06cf8837ace5?w=300&h=300&fit=crop',
    //   commission: 7.50
    // },
    // {
    //   id: 'S003',
    //   artworkTitle: 'Golden Hour',
    //   buyerName: 'David Wilson',
    //   price: 300.00,
    //   saleDate: '2024-01-22',
    //   status: 'processing',
    //   imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop',
    //   commission: 30.00
    // }
  ];

  const getBuyerStatusColor = (status) => {
    switch (status) {
      case 'delivered': return '#10B981'; // Green - completed
      case 'shipped': return '#3B82F6';   // Blue - in transit
      case 'ordered': return '#F59E0B';   // Orange - pending
      default: return '#6B7280';
    }
  };

  const getBuyerStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return '✅'; // Delivered successfully
      case 'shipped': return '🚚';   // In transit
      case 'ordered': return '📦';   // Order confirmed, preparing
      default: return '📋';
    }
  };

  const getSellerStatusColor = (status) => {
    switch (status) {
      case 'delivered': return '#10B981';
      case 'shipped': return '#3B82F6';
      case 'processing': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const getSellerStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return '✅';
      case 'shipped': return '🚚';
      case 'processing': return '⏳';
      default: return '📦';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const renderBuyerOrderCard = (order) => (
    <View key={order.id} style={styles.orderCard}>
      <Image source={{ uri: order.imageUrl }} style={styles.orderImage} />
      <View style={styles.orderDetails}>
        <View style={styles.orderHeader}>
          <Text style={styles.orderTitle}>{order.artworkTitle}</Text>
          <Text style={styles.orderPrice}>${order.price.toFixed(2)}</Text>
        </View>
        <Text style={styles.artistName}>by {order.artistName}</Text>
        <View style={styles.orderInfo}>
          <Text style={styles.orderDate}>Ordered {formatDate(order.orderDate)}</Text>
          <View style={styles.statusContainer}>
            <Text style={styles.statusIcon}>{getBuyerStatusIcon(order.status)}</Text>
            <Text style={[styles.statusText, { color: getBuyerStatusColor(order.status) }]}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Text>
          </View>
        </View>
        
        {/* Status-specific information */}
        {order.status === 'ordered' && (
          <Text style={styles.statusInfo}>Waiting for seller to ship</Text>
        )}
        {order.status === 'shipped' && order.trackingNumber && (
          <View>
            <Text style={styles.trackingNumber}>Tracking: {order.trackingNumber}</Text>
            {order.shippedDate && (
              <Text style={styles.statusInfo}>Shipped: {formatDate(order.shippedDate)}</Text>
            )}
          </View>
        )}
        {order.status === 'delivered' && (
          <View>
            {order.trackingNumber && (
              <Text style={styles.trackingNumber}>Tracking: {order.trackingNumber}</Text>
            )}
            {order.deliveryDate && (
              <Text style={styles.deliveredInfo}>Delivered: {formatDate(order.deliveryDate)}</Text>
            )}
          </View>
        )}
      </View>
    </View>
  );

  const handleOrderPress = (order, navigation) => {
    if (order.status === 'processing') {
      // Navigate to SubmitTrackingNumber screen with order data
      const orderData = {
        orderId: order.id,
        artName: order.artworkTitle,
        artistName: 'Your Artwork', // Since this is seller's view
        price: order.price,
        imageLink: order.imageUrl,
        buyerName: order.buyerName,
        saleDate: order.saleDate
      };
      navigation.navigate('SubmitTrackingNumber', { orderData });
    }
  };

  const renderSellerOrderCard = (order, navigation) => {
    const CardWrapper = order.status === 'processing' ? TouchableOpacity : View;
    
    return (
      <CardWrapper 
        key={order.id} 
        style={[
          styles.orderCard,
          order.status === 'processing' && styles.clickableOrderCard
        ]}
        onPress={order.status === 'processing' ? () => handleOrderPress(order, navigation) : undefined}
        activeOpacity={order.status === 'processing' ? 0.7 : 1}
      >
        <Image source={{ uri: order.imageUrl }} style={styles.orderImage} />
        <View style={styles.orderDetails}>
          <View style={styles.orderHeader}>
            <Text style={styles.orderTitle}>{order.artworkTitle}</Text>
            <Text style={styles.orderPrice}>${order.price.toFixed(2)}</Text>
          </View>
          <Text style={styles.artistName}>Sold to {order.buyerName}</Text>
          <View style={styles.orderInfo}>
            <Text style={styles.orderDate}>Sold {formatDate(order.saleDate)}</Text>
            <View style={styles.statusContainer}>
              <Text style={styles.statusIcon}>{getSellerStatusIcon(order.status)}</Text>
              <Text style={[styles.statusText, { color: getSellerStatusColor(order.status) }]}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Text>
            </View>
          </View>
          <Text style={styles.commission}>Commission: ${order.commission.toFixed(2)}</Text>
          {order.status === 'processing' && (
            <Text style={styles.tapToShipHint}>Tap to add tracking number</Text>
          )}
        </View>
        {order.status === 'processing' && (
          <View style={styles.arrowIndicator}>
            <Text style={styles.arrowIcon}>→</Text>
          </View>
        )}
      </CardWrapper>
    );
  };

  const groupOrdersByStatus = (orders) => {
    const grouped = {
      ordered: [],
      shipped: [],
      delivered: []
    };
    
    orders.forEach(order => {
      if (grouped[order.status]) {
        grouped[order.status].push(order);
      }
    });
    
    return grouped;
  };

  const renderStatusSection = (statusKey, orders, icon, title, color) => {
    if (orders.length === 0) return null;
    
    return (
      <View style={styles.statusSection} key={statusKey}>
        <View style={[styles.statusHeader, { backgroundColor: color + '15' }]}>
          <View style={styles.statusHeaderLeft}>
            <Text style={styles.statusHeaderIcon}>{icon}</Text>
            <View>
              <Text style={styles.statusHeaderTitle}>{title}</Text>
              <Text style={styles.statusHeaderCount}>{orders.length} item{orders.length !== 1 ? 's' : ''}</Text>
            </View>
          </View>
          <View style={[styles.statusIndicator, { backgroundColor: color }]} />
        </View>
        
        <View style={styles.statusOrdersList}>
          {orders.map(order => renderBuyerOrderCard(order))}
        </View>
      </View>
    );
  };

  const renderEmptyBuyerState = () => (
    <View style={styles.emptyStateCard}>
      <View style={styles.emptyIconContainer}>
        <Text style={styles.emptyIcon}>🛒</Text>
      </View>
      <Text style={styles.emptyText}>No Orders Yet</Text>
      <Text style={styles.emptySubtext}>
        When you purchase artwork, your orders will appear here with tracking information.
      </Text>
    </View>
  );

  const renderOrderDashboard = () => {
    const groupedOrders = groupOrdersByStatus(buyerOrders);
    const totalOrders = buyerOrders.length;
    
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#635BFF" />
          <Text style={styles.loadingText}>Loading your orders...</Text>
        </View>
      );
    }
    
    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load orders</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchOrders}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    if (totalOrders === 0) {
      return renderEmptyBuyerState();
    }
    
    const dashboardCards = [
      {
        key: 'ordered',
        title: 'Order Confirmed',
        icon: '📦',
        count: groupedOrders.ordered.length,
        color: '#F59E0B',
        description: 'Waiting to ship'
      },
      {
        key: 'shipped',
        title: 'In Transit',
        icon: '🚚',
        count: groupedOrders.shipped.length,
        color: '#3B82F6',
        description: 'On the way'
      },
      {
        key: 'delivered',
        title: 'Delivered',
        icon: '✅',
        count: groupedOrders.delivered.length,
        color: '#10B981',
        description: 'Completed'
      }
    ];

    return (
      <View style={styles.dashboardWrapper}>
        <View style={styles.dashboardContainer}>
          {dashboardCards.map((card, index) => (
            <TouchableOpacity
              key={card.key}
              style={[
                styles.dashboardCard,
                dashboardCards.length === 3 && index === 2 && styles.dashboardCardSingle
              ]}
              onPress={() => setSelectedStatus(card.key)}
            >
              <View style={[styles.dashboardCardHeader, { backgroundColor: card.color + '15' }]}>
                <Text style={styles.dashboardIcon}>{card.icon}</Text>
                <Text style={styles.dashboardCount}>{card.count}</Text>
              </View>
              <Text style={styles.dashboardTitle}>{card.title}</Text>
              <Text style={styles.dashboardDescription}>{card.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const renderStatusDetail = (status) => {
    const groupedOrders = groupOrdersByStatus(buyerOrders);
    const statusData = {
      ordered: { title: 'Order Confirmed', icon: '📦', color: '#F59E0B' },
      shipped: { title: 'In Transit', icon: '🚚', color: '#3B82F6' },
      delivered: { title: 'Delivered', icon: '✅', color: '#10B981' }
    };

    const data = statusData[status];
    const orders = groupedOrders[status];

    return (
      <View style={styles.ordersContent}>
        <View style={styles.detailHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSelectedStatus(null)}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <View style={styles.detailHeaderContent}>
            <Text style={styles.detailIcon}>{data.icon}</Text>
            <View>
              <Text style={styles.detailTitle}>{data.title}</Text>
              <Text style={styles.detailSubtitle}>{orders.length} order{orders.length !== 1 ? 's' : ''}</Text>
            </View>
          </View>
        </View>
        
        <ScrollView 
          style={styles.ordersList}
          contentContainerStyle={styles.ordersListContainer}
          showsVerticalScrollIndicator={false}
        >
          {orders.map(order => renderBuyerOrderCard(order))}
        </ScrollView>
      </View>
    );
  };

  const renderBuyerOrders = () => {
    return (
      <View style={styles.ordersContent}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>🛒</Text>
          <View style={styles.sectionTextContainer}>
            <Text style={styles.sectionTitle}>Your Purchases</Text>
            <Text style={styles.sectionSubtitle}>{buyerOrders.length} total orders</Text>
          </View>
        </View>
        
        {selectedStatus === null ? renderOrderDashboard() : renderStatusDetail(selectedStatus)}
      </View>
    );
  };

  const renderEmptySellerState = () => (
    <View style={styles.emptyStateCard}>
      <View style={styles.emptyIconContainer}>
        <Text style={styles.emptyIcon}>💰</Text>
      </View>
      <Text style={styles.emptyText}>No Sales Yet</Text>
      <Text style={styles.emptySubtext}>
        When people purchase your artwork, sales will appear here for shipping management.
      </Text>
    </View>
  );

  const renderSellerDashboard = () => {
    const groupedOrders = groupOrdersBySellerStatus(sellerOrders);
    const totalOrders = sellerOrders.length;
    
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#635BFF" />
          <Text style={styles.loadingText}>Loading your sales...</Text>
        </View>
      );
    }
    
    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load sales</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchOrders}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    if (totalOrders === 0) {
      return renderEmptySellerState();
    }
    
    const dashboardCards = [
      {
        key: 'processing',
        title: 'Needs Shipping',
        icon: '📦',
        count: groupedOrders.processing.length,
        color: '#F59E0B',
        description: 'Ready to ship'
      },
      {
        key: 'shipped',
        title: 'In Transit',
        icon: '🚚',
        count: groupedOrders.shipped.length,
        color: '#3B82F6',
        description: 'On the way'
      },
      {
        key: 'delivered',
        title: 'Completed',
        icon: '✅',
        count: groupedOrders.delivered.length,
        color: '#10B981',
        description: 'Successfully delivered'
      }
    ];

    return (
      <View style={styles.dashboardWrapper}>
        <View style={styles.dashboardContainer}>
          {dashboardCards.map((card, index) => (
            <TouchableOpacity
              key={card.key}
              style={[
                styles.dashboardCard,
                dashboardCards.length === 3 && index === 2 && styles.dashboardCardSingle
              ]}
              onPress={() => setSelectedSellerStatus(card.key)}
            >
              <View style={[styles.dashboardCardHeader, { backgroundColor: card.color + '15' }]}>
                <Text style={styles.dashboardIcon}>{card.icon}</Text>
                <Text style={styles.dashboardCount}>{card.count}</Text>
              </View>
              <Text style={styles.dashboardTitle}>{card.title}</Text>
              <Text style={styles.dashboardDescription}>{card.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const groupOrdersBySellerStatus = (orders) => {
    const grouped = {
      processing: [],
      shipped: [],
      delivered: []
    };
    
    orders.forEach(order => {
      if (grouped[order.status]) {
        grouped[order.status].push(order);
      }
    });
    
    return grouped;
  };

  const renderSellerStatusDetail = (status) => {
    const groupedOrders = groupOrdersBySellerStatus(sellerOrders);
    const statusData = {
      processing: { title: 'Needs Shipping', icon: '📦', color: '#F59E0B' },
      shipped: { title: 'In Transit', icon: '🚚', color: '#3B82F6' },
      delivered: { title: 'Completed', icon: '✅', color: '#10B981' }
    };

    const data = statusData[status];
    const orders = groupedOrders[status];

    return (
      <View style={styles.ordersContent}>
        <View style={styles.detailHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSelectedSellerStatus(null)}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <View style={styles.detailHeaderContent}>
            <Text style={styles.detailIcon}>{data.icon}</Text>
            <View>
              <Text style={styles.detailTitle}>{data.title}</Text>
              <Text style={styles.detailSubtitle}>{orders.length} order{orders.length !== 1 ? 's' : ''}</Text>
            </View>
          </View>
        </View>
        
        <ScrollView 
          style={styles.ordersList}
          contentContainerStyle={styles.ordersListContainer}
          showsVerticalScrollIndicator={false}
        >
          {orders.map(order => renderSellerOrderCard(order, navigation))}
        </ScrollView>
      </View>
    );
  };

  const renderSellerOrders = () => {
    return (
      <View style={styles.ordersContent}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>💰</Text>
          <View style={styles.sectionTextContainer}>
            <Text style={styles.sectionTitle}>Your Sales</Text>
            <Text style={styles.sectionSubtitle}>{sellerOrders.length} total sales</Text>
          </View>
        </View>
        
        {selectedSellerStatus === null ? renderSellerDashboard() : renderSellerStatusDetail(selectedSellerStatus)}
      </View>
    );
  };

  return (
    <ScreenTemplate>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>My Orders</Text>
          <Text style={styles.subtitle}>Manage your purchases and sales</Text>
        </View>
        
        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'buyer' && styles.activeTab]}
            onPress={() => {
              setActiveTab('buyer');
              setSelectedStatus(null);
              setSelectedSellerStatus(null);
            }}
          >
            <Text style={styles.tabEmoji}>🛒</Text>
            <Text style={[styles.tabText, activeTab === 'buyer' && styles.activeTabText]}>
              Buyer
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'seller' && styles.activeTab]}
            onPress={() => {
              setActiveTab('seller');
              setSelectedStatus(null);
              setSelectedSellerStatus(null);
            }}
          >
            <Text style={styles.tabEmoji}>💰</Text>
            <Text style={[styles.tabText, activeTab === 'seller' && styles.activeTabText]}>
              Seller
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {activeTab === 'buyer' ? renderBuyerOrders() : renderSellerOrders()}
        </View>
      </View>
    </ScreenTemplate>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 16,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: '#635BFF',
    shadowColor: '#635BFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  tabEmoji: {
    fontSize: 18,
    marginRight: 8,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#666',
  },
  activeTabText: {
    color: 'white',
  },
  content: {
    flex: 1,
    marginTop: 20,
    paddingHorizontal: 20,
  },
  ordersContent: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  emptyStateCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    marginTop: 20,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyIcon: {
    fontSize: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  browseButton: {
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  browseButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: 'center',
  },
  browseButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  sectionTextContainer: {
    flex: 1,
  },
  ordersList: {
    flex: 1,
  },
  ordersListContainer: {
    paddingBottom: 20,
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 8,
    padding: 12,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  clickableOrderCard: {
    borderWidth: 1,
    borderColor: '#F59E0B',
    backgroundColor: '#FFF8E1',
  },
  orderImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  orderDetails: {
    flex: 1,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  orderTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  orderPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: '#635BFF',
  },
  artistName: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  orderInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  orderDate: {
    fontSize: 11,
    color: '#999',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    fontSize: 10,
    marginRight: 3,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  trackingNumber: {
    fontSize: 10,
    color: '#666',
    fontFamily: 'monospace',
    marginTop: 2,
  },
  commission: {
    fontSize: 10,
    color: '#10B981',
    fontWeight: '600',
    marginTop: 2,
  },
  statusInfo: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
    fontStyle: 'italic',
  },
  deliveredInfo: {
    fontSize: 10,
    color: '#10B981',
    fontWeight: '600',
    marginTop: 2,
  },
  statusSection: {
    marginBottom: 12,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 6,
  },
  statusHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusHeaderIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  statusHeaderTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 1,
  },
  statusHeaderCount: {
    fontSize: 11,
    color: '#666',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusOrdersList: {
    paddingLeft: 4,
  },
  dashboardWrapper: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  dashboardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  dashboardCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    minWidth: 140,
    marginBottom: 12,
    marginHorizontal: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexGrow: 1,
    maxWidth: '48%',
  },
  dashboardCardSingle: {
    width: '48%',
    alignSelf: 'center',
  },
  dashboardCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  dashboardIcon: {
    fontSize: 24,
  },
  dashboardCount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  dashboardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  dashboardDescription: {
    fontSize: 12,
    color: '#666',
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  backIcon: {
    fontSize: 18,
    color: '#635BFF',
    fontWeight: 'bold',
  },
  detailHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 2,
  },
  detailSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  tapToShipHint: {
    fontSize: 10,
    color: '#F59E0B',
    fontWeight: '600',
    marginTop: 4,
    fontStyle: 'italic',
  },
  arrowIndicator: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  arrowIcon: {
    fontSize: 16,
    color: '#F59E0B',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#635BFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});