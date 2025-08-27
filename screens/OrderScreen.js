import React, { useState } from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import ScreenTemplate from "./Template/ScreenTemplate";

export default function OrderScreen() {
  const [activeTab, setActiveTab] = useState('buyer');
  const [selectedStatus, setSelectedStatus] = useState(null); // null shows dashboard, status shows specific section

  // Sample data for buyer orders (purchases)
  const sampleBuyerOrders = [
    // Delivered Orders
    {
      id: 'B001',
      artworkTitle: 'Sunset Dreams',
      artistName: 'Sarah Johnson',
      price: 125.00,
      orderDate: '2024-01-15',
      status: 'delivered',
      imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=300&fit=crop',
      trackingNumber: 'TRK123456789',
      deliveryDate: '2024-01-22'
    },
    {
      id: 'B004',
      artworkTitle: 'Ocean Waves',
      artistName: 'Maria Garcia',
      price: 95.00,
      orderDate: '2024-01-10',
      status: 'delivered',
      imageUrl: 'https://images.unsplash.com/photo-1544967882-7a8e72c2ae37?w=300&h=300&fit=crop',
      trackingNumber: 'TRK555666777',
      deliveryDate: '2024-01-18'
    },
    // Shipped Orders
    {
      id: 'B002',
      artworkTitle: 'Urban Abstract',
      artistName: 'Mike Chen',
      price: 89.50,
      orderDate: '2024-01-20',
      status: 'shipped',
      imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop',
      trackingNumber: 'TRK987654321',
      shippedDate: '2024-01-22'
    },
    // Ordered (Confirmed)
    {
      id: 'B003',
      artworkTitle: 'Nature\'s Whisper',
      artistName: 'Emily Rose',
      price: 200.00,
      orderDate: '2024-01-25',
      status: 'ordered',
      imageUrl: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=300&h=300&fit=crop',
      trackingNumber: null,
      estimatedShipping: '2024-01-30'
    },
    {
      id: 'B005',
      artworkTitle: 'Mountain Peak',
      artistName: 'David Park',
      price: 175.00,
      orderDate: '2024-01-26',
      status: 'ordered',
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop',
      trackingNumber: null,
      estimatedShipping: '2024-01-31'
    }
  ];

  // Sample data for seller orders (sales)
  const sampleSellerOrders = [
    {
      id: 'S001',
      artworkTitle: 'Digital Horizon',
      buyerName: 'Alex Thompson',
      price: 150.00,
      saleDate: '2024-01-10',
      status: 'delivered',
      imageUrl: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=300&h=300&fit=crop',
      commission: 15.00
    },
    {
      id: 'S002',
      artworkTitle: 'Midnight Blues',
      buyerName: 'Jessica Park',
      price: 75.00,
      saleDate: '2024-01-18',
      status: 'shipped',
      imageUrl: 'https://images.unsplash.com/photo-1549289524-06cf8837ace5?w=300&h=300&fit=crop',
      commission: 7.50
    },
    {
      id: 'S003',
      artworkTitle: 'Golden Hour',
      buyerName: 'David Wilson',
      price: 300.00,
      saleDate: '2024-01-22',
      status: 'processing',
      imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop',
      commission: 30.00
    }
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

  const renderSellerOrderCard = (order) => (
    <View key={order.id} style={styles.orderCard}>
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
      </View>
    </View>
  );

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

  const renderOrderDashboard = () => {
    const groupedOrders = groupOrdersByStatus(sampleBuyerOrders);
    
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
      <View style={styles.dashboardContainer}>
        {dashboardCards.map(card => (
          <TouchableOpacity
            key={card.key}
            style={styles.dashboardCard}
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
    );
  };

  const renderStatusDetail = (status) => {
    const groupedOrders = groupOrdersByStatus(sampleBuyerOrders);
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
        
        <View style={styles.ordersList}>
          {orders.map(order => renderBuyerOrderCard(order))}
        </View>
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
            <Text style={styles.sectionSubtitle}>{sampleBuyerOrders.length} total orders</Text>
          </View>
        </View>
        
        {selectedStatus === null ? renderOrderDashboard() : renderStatusDetail(selectedStatus)}
      </View>
    );
  };

  const renderSellerOrders = () => (
    <View style={styles.ordersContent}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionIcon}>💰</Text>
        <View style={styles.sectionTextContainer}>
          <Text style={styles.sectionTitle}>Your Sales</Text>
          <Text style={styles.sectionSubtitle}>{sampleSellerOrders.length} sales</Text>
        </View>
      </View>
      
      <View style={styles.ordersList}>
        {sampleSellerOrders.map(order => renderSellerOrderCard(order))}
      </View>
    </View>
  );

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
            }}
          >
            <Text style={styles.tabEmoji}>💰</Text>
            <Text style={[styles.tabText, activeTab === 'seller' && styles.activeTabText]}>
              Seller
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView 
          style={styles.content} 
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {activeTab === 'buyer' ? renderBuyerOrders() : renderSellerOrders()}
        </ScrollView>
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
  },
  contentContainer: {
    flexGrow: 1,
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
  dashboardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  dashboardCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
});