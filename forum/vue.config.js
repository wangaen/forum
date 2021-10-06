const CompressionPlugin = require("compression-webpack-plugin");
module.exports = {
  devServer: {
    hot: false,
    inline: false,
  },
  chainWebpack: (config) => {
    config.plugin("html").tap((args) => {
      args[0].title = "外贸通";
      return args;
    });
  },
  configureWebpack: () => {
      if (process.env.NODE_ENV === "production") {
          return {

              plugins: [
                  new CompressionPlugin({
                      test: /\.js$|\.ts$|\.html$|\.css$|\.jpg$|\.jpeg$|\.png/, // 需要压缩的文件类型
                      threshold: 10240, // 归档需要进行压缩的文件大小最小值，10K以上的进行压缩
                      deleteOriginalAssets: false, // 是否删除原文件
                  }),
              ],
          };
      }
  },
};
