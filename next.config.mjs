/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // saju-core 는 컴파일하지 않은 TS 소스를 내보내므로 트랜스파일 대상에 포함
  transpilePackages: ["saju-core"],
};

export default nextConfig;
