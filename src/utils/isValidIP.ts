// export function isValidIP(ip: string): boolean {
//   const ipv4Regex = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
//   return ipv4Regex.test(ip);
// }

import ip from 'ip';

export function isValidIP(ip: string): boolean {
  // 匹配 IPv4 地址部分
  const ipv4Part = '(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)';
  const ipv4 = `(?:${ipv4Part}\\.){3}${ipv4Part}`;
  
  // 匹配可选的 CIDR 前缀（/0 到 /32）
  const cidr = `(?:\\/(?:[0-9]|[12][0-9]|3[0-2]))?`;
  
  // 组合成完整正则
  const regex = new RegExp(`^${ipv4}${cidr}$`);
  
  return regex.test(ip);
}

export function isCidr(str: string): boolean {
  return str.includes('/')
}
export function matchIpOrCidr(targetIp: string, pattern: string): boolean {
  
  if (pattern === targetIp) return true;

  if (isCidr(pattern)) {
    try {
      return ip.cidrSubnet(pattern).contains(targetIp);
    } catch (error) {
      return false;
    }
  }

  return false
}