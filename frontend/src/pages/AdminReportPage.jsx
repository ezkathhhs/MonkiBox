import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../components/4_templates/AdminLayout';
import './AdminReportPage.css'; // Vamos a actualizar este CSS

// Componentes de Gráficos
import SalesLineChart from '../components/3_organisms/charts/SalesLineChart';
import CategoryDoughnutChart from '../components/3_organisms/charts/CategoryDoughnutChart';

const API_URL = 'http://localhost:4000/api';

const AdminReportPage = () => {
  // Estados para cada reporte
  const [summary, setSummary] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [salesByDay, setSalesByDay] = useState([]);
  const [categoryDist, setCategoryDist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Formateador de precio
  const formatPrice = (price) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(price);

  useEffect(() => {
    const fetchAllReports = async () => {
      try {
        setLoading(true);
        const [summaryRes, topProductsRes, recentOrdersRes, salesDayRes, categoryRes] = await Promise.all([
          axios.get(`${API_URL}/reports/summary`),
          axios.get(`${API_URL}/reports/top-selling`),
          axios.get(`${API_URL}/reports/recent-orders`),
          axios.get(`${API_URL}/reports/sales-by-day`),
          axios.get(`${API_URL}/reports/category-distribution`)
        ]);

        setSummary(summaryRes.data);
        setTopProducts(topProductsRes.data);
        setRecentOrders(recentOrdersRes.data);
        setSalesByDay(salesDayRes.data);
        setCategoryDist(categoryRes.data);
      } catch (error) {
        console.error("Error al cargar reportes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllReports();
  }, []);

  if (loading || !summary) {
    return <AdminLayout><p>Generando reportes...</p></AdminLayout>;
  }

  return (
    <AdminLayout>
      {/* Fila 1: KPIs (4 tarjetas) */}
      <div className="report-row kpi-row">
        <KPIBox title="Ventas Totales" value={formatPrice(summary.totalRevenue)} color="green" />
        <KPIBox title="Pedidos Totales" value={summary.totalOrders} color="blue" />
        <KPIBox title="Clientes Nuevos (7 días)" value={summary.newUsersThisWeek} color="purple" />
        <KPIBox title="Productos Vendidos" value={summary.totalProductsSold} color="red" />
      </div>
      
      {/* Fila 2: Gráficos (3 tarjetas) */}
      <div className="report-row charts-row">
        <ChartBox title="Ventas por Día (Últimos 7 días)">
          <SalesLineChart salesData={salesByDay} />
        </ChartBox>
        <ChartBox title="Productos Más Vendidos">
          {/* Usamos un gráfico de barras simple (CSS) */}
          <BarChart data={topProducts} /> 
        </ChartBox>
        <ChartBox title="Distribución de Categorías">
          <CategoryDoughnutChart categoryData={categoryDist} />
        </ChartBox>
      </div>
      
      {/* Fila 3: Tablas (3 tarjetas) */}
      <div className="report-row tables-row">
        <TableBox title="Últimos Pedidos">
          <RecentOrdersTable orders={recentOrders} formatPrice={formatPrice} />
        </TableBox>
        <TableBox title="Productos Populares">
          <TopProductsTable products={topProducts} />
        </TableBox>
        <TableBox title="Métricas de Rendimiento">
          <MetricsTable summary={summary} formatPrice={formatPrice} />
        </TableBox>
      </div>
    </AdminLayout>
  );
};

// --- Componentes Internos de la Página ---

// Tarjeta KPI
const KPIBox = ({ title, value, color }) => (
  <div className={`report-box kpi-box ${color}`}>
    <span>{title}</span>
    <strong>{value}</strong>
  </div>
);

// Contenedor genérico para Gráficos o Tablas
const ChartBox = ({ title, children }) => (
  <div className="report-box chart-box">
    <h3>{title}</h3>
    <div className="chart-content">{children}</div>
  </div>
);
const TableBox = ({ title, children }) => (
  <div className="report-box table-box">
    <h3>{title}</h3>
    {children}
  </div>
);

// Gráfico de Barras CSS (simple)
const BarChart = ({ data }) => {
  const maxSold = Math.max(...data.map(d => d.total_sold), 1); // Evita dividir por 0
  return (
    <div className="css-bar-chart">
      {data.map(item => (
        <div className="bar-item" key={item.product_name}>
          <span className="bar-label">{item.product_name}</span>
          <div className="bar-wrapper">
            <div 
              className="bar" 
              style={{ width: `${(item.total_sold / maxSold) * 100}%` }}
            >
              {item.total_sold}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Tabla Últimos Pedidos
const RecentOrdersTable = ({ orders, formatPrice }) => (
  <table className="report-table">
    <thead><tr><th>ID</th><th>Cliente</th><th>Total</th><th>Estado</th></tr></thead>
    <tbody>
      {orders.map(o => (
        <tr key={o.order_id}>
          <td>#{o.order_id}</td>
          <td>{o.customer_name}</td>
          <td>{formatPrice(o.total_amount)}</td>
          <td><span className={`status-pill-small ${o.order_status.replace(' ', '-').toLowerCase()}`}>{o.order_status}</span></td>
        </tr>
      ))}
    </tbody>
  </table>
);

// Tabla Productos Populares
const TopProductsTable = ({ products }) => (
  <table className="report-table">
    <thead><tr><th>Producto</th><th>Ventas</th><th>Stock</th></tr></thead>
    <tbody>
      {products.map(p => (
        <tr key={p.product_name}>
          <td>{p.product_name}</td>
          <td>{p.total_sold}</td>
          <td>{p.stock}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

// Tabla Métricas
const MetricsTable = ({ summary, formatPrice }) => (
  <div className="metrics-list">
    <div className="metric-item">
      <span>Ticket Promedio</span>
      <strong>{formatPrice(summary.avgTicket)}</strong>
    </div>
    <div className="metric-item">
      <span>Tasa de Conversión</span>
      <strong>N/A</strong>
    </div>
    <div className="metric-item">
      <span>Productos por Pedido</span>
      <strong>{summary.avgProductsPerOrder}</strong>
    </div>
    <div className="metric-item">
      <span>Clientes Recurrentes</span>
      <strong>{summary.recurringCustomerRate}%</strong>
    </div>
  </div>
);

export default AdminReportPage;