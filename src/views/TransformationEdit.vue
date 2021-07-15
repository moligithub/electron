<template>
  <div class="transformation-edit">
    <div v-if="panes.length === 0" class="empty">
      <!-- <a-empty :description="'暂无文件，快去打开文件吧'" /> -->
      <div @click="clickButtonFile" class="upload-container">
        <div class="icon">
          <img src="../assets/images/upload.svg" alt="" />
        </div>
        <div class="title">暂无文件，快去打开文件吧</div>
      </div>
    </div>
    <a-tabs
      v-else
      v-model="activeKey"
      @change="changeTab"
      hide-add
      style="padding-right: 30px"
      id="transformation-edit"
      type="editable-card"
      @edit="onEdit"
    >
      <a-tab-pane
        v-for="pane in panes"
        :key="pane.key"
        forceRender
        :tab="pane.title"
        :closable="pane.closable"
      >
        <div class="pane-body">
          <div v-if="false" class="handle-setting">
            <div class="handle-icons">
              <a @click="clearEnter()" class="handle-btn" type="link">空白行</a>
              <a @click="clearSpace()" class="handle-btn" type="link">空格</a>
              <a @click="deleteEnter(0)" class="handle-btn" type="link"
                >段首空白</a
              >
              <a @click="deleteEnter(1)" class="handle-btn" type="link"
                >段尾空白</a
              >
              <a
                v-if="pane.type === 'docx'"
                @click="clearMark()"
                class="handle-btn"
                type="link"
                >上标、下标</a
              >
              <a
                v-if="pane.type === 'docx'"
                @click="clearNotes()"
                class="handle-btn"
                type="link"
                >脚注、尾注</a
              >
              <a @click="clearPBefore()" class="handle-btn" type="link"
                >段首编号</a
              >
              <a @click="insertSp(1)" class="handle-btn" type="link"
                >中文插入空格</a
              >
              <a @click="changeChart('ToDBC')" class="handle-btn" type="link"
                >转全角</a
              >
              <a @click="changeChart('ToCDB')" class="handle-btn" type="link"
                >转半角</a
              >
              <a @click="toLowerCase" class="handle-btn" type="link"
                >字母转小写</a
              >
              <a @click="toUpperCase" class="handle-btn" type="link"
                >字母转大写</a
              >
              <a @click="mergeEnter(0)" class="handle-btn" type="link"
                >合并回车分行</a
              >
              <a @click="mergeEnter(2)" class="handle-btn" type="link"
                >按序号分行</a
              >
            </div>
            <div class="gaoji">
              <a-button type="link" @click="openDrawer(0)">工具</a-button>
              <a-button type="link" @click="openDrawer(1)">高级</a-button>
            </div>
          </div>
          <div class="code-textarea-div">
            <textarea
              class="code-textarea"
              placeholder="请输入内容"
              :dataKey="pane.domRef"
              :ref="pane.domRef"
              name="code"
            >
            </textarea>
          </div>
        </div>
      </a-tab-pane>
    </a-tabs>

    <!-- <a-drawer
      title=""
      :placement="drawer.position"
      :closable="true"
      :get-container="false"
      :mask="false"
      :height="drawer.position === 'bottom' ? 200 : null"
      :wrap-style="{ position: 'absolute' }"
      v-if="drawer.visible"
      :visible="drawer.visible"
      @close="onClose"
    >
      
    </a-drawer> -->
    <div v-if="panes.length > 0" class="drawer-class drawer-top-class">
      <div class="icon-close icon-close-top" @click="showDrawer(0)">
        <a-icon v-if="drawer.visible0" type="right" />
        <a-icon v-else type="left" />
      </div>
      <div
        :style="{ width: drawer.visible0 ? '130px' : '0px' }"
        class="handle-texts"
      >
        <div class="handle-group">
          <div class="handle-group-title">内容清理</div>
          <div class="handle-group-body">
            <a-button @click="clearEnter()" class="handle-btn" type="dashed"
              >清理空白行</a-button
            >
            <a-button @click="clearSpace()" class="handle-btn" type="dashed"
              >空格</a-button
            >
            <a-button @click="deleteEnter(0)" class="handle-btn" type="dashed"
              >清理所有段首空白</a-button
            >
            <a-button @click="deleteEnter(1)" class="handle-btn" type="dashed"
              >清理所有段尾空白</a-button
            >
            <!-- <a-button @click="clearMark" class="handle-btn" type="dashed"
              >清理上标、下标标号</a-button
            >
            <a-button
              @clicl="clearNotes"
              :disabled="true"
              class="handle-btn"
              type="dashed"
              >清理脚注、尾注内容</a-button
            > -->
            <a-button @click="clearPBefore()" class="handle-btn" type="dashed"
              >清理段首编号</a-button
            >
          </div>
        </div>
        <div class="handle-group">
          <div class="handle-group-title">插入</div>
          <div class="handle-group-body">
            <a-button @click="insertSp(1)" class="handle-btn" type="dashed"
              >中文字间插入空格</a-button
            >
          </div>
        </div>
        <div class="handle-group">
          <div class="handle-group-title">转换</div>
          <div class="handle-group-body">
            <a-button
              @click="changeChart('ToDBC')"
              class="handle-btn"
              type="dashed"
              >半角转全角</a-button
            >
            <a-button
              @click="changeChart('ToCDB')"
              class="handle-btn"
              type="dashed"
              >全角转半角</a-button
            >
            <a-button @click="toLowerCase" class="handle-btn" type="dashed"
              >字母转成全小写</a-button
            >
            <a-button @click="toUpperCase" class="handle-btn" type="dashed"
              >字母转成全大写</a-button
            >
          </div>
        </div>
        <div class="handle-group">
          <div class="handle-group-title">分行/合并</div>
          <div class="handle-group-body">
            <a-button @click="mergeEnter(0)" class="handle-btn" type="dashed"
              >合并回车分行</a-button
            >
            <a-button @click="mergeEnter(2)" class="handle-btn" type="dashed"
              >按段落中的序号分行</a-button
            >
          </div>
        </div>
      </div>
    </div>
    <div v-if="panes.length > 0" class="drawer-class drawer-bottom-class">
      <div class="icon-close icon-close-bottom" @click="showDrawer(1)">
        <a-icon v-if="drawer.visible1" type="down" />
        <a-icon v-else type="up" />
      </div>
      <div
        :style="{ height: drawer.visible1 ? '150px' : '0px' }"
        class="setting"
      >
        <div class="setting-title">高级</div>
        <div class="setting-body">
          <div class="setting-group">
            <div class="setting-group-title">格式设置：</div>
            <div class="setting-group-value">
              <a-select
                v-model="exportConfig.suffix"
                style="width: 100%; margin-top: 15px"
                placeholder="请选择文件保存格式"
              >
                <a-select-option value="txt"> TXT </a-select-option>
                <a-select-option value="tmx"> TMX </a-select-option>
                <a-select-option value="tbx"> TBX </a-select-option>
                <a-select-option value="xliff"> XLIFF </a-select-option>
                <a-select-option value="docx"> WORD </a-select-option>
                <a-select-option value="xlsx"> EXCEL </a-select-option>
              </a-select>
              <a-select
                v-model="exportConfig.format"
                v-if="exportConfig.suffix === 'txt'"
                style="width: 100%; margin-top: 15px"
                placeholder="请选择编码格式"
              >
                <a-select-option value="utf8"> utf-8 </a-select-option>
                <a-select-option value="utf16"> utf-16 </a-select-option>
                <a-select-option value="gbk"> gbk </a-select-option>
              </a-select>
            </div>
          </div>
          <div
            style="width: 220px"
            v-if="['txt', 'docx'].includes(exportConfig.suffix)"
            class="setting-group"
          >
            <div class="setting-group-title">分隔设置：</div>
            <div class="setting-group-value">
              <a-radio-group v-model="exportConfig.separate.type">
                <a-radio style="margin-top: 15px" :value="1">
                  <div style="display: inline-block">
                    <div class="input-group">
                      <div class="input-title">字符</div>
                      <div class="input-value">
                        <a-input
                          placeholder="请输入分隔字符"
                          style="width: 140px"
                          v-model="exportConfig.separate.character"
                        ></a-input>
                      </div>
                    </div>
                  </div>
                </a-radio>
                <a-radio style="margin-top: 15px" :value="0">
                  段落标记
                </a-radio>
              </a-radio-group>
            </div>
          </div>
          <div
            v-if="['txt', 'docx'].includes(exportConfig.suffix)"
            class="setting-group"
          >
            <div class="setting-group-title">保留单语种：</div>
            <div class="setting-group-value">
              <div style="margin-top: 15px; height: 32px">
                <a-checkbox v-model="exportConfig.lang.isZh"> 中文 </a-checkbox>
              </div>
              <div style="margin-top: 15px; height: 32px">
                <a-checkbox v-model="exportConfig.lang.isEn"> 外文 </a-checkbox>
              </div>
            </div>
          </div>
          <div
            v-if="['txt', 'docx'].includes(exportConfig.suffix)"
            style="width: 320px"
            class="setting-group"
          >
            <div class="setting-group-title">插入：</div>
            <div class="setting-group-value">
              <div style="margin-top: 15px" class="input-group">
                <div class="input-title">段首</div>
                <div class="input-value">
                  <a-input
                    style="width: 160px"
                    placeholder="请输入待插入的字符"
                    v-model="exportConfig.insert.before"
                  ></a-input>
                </div>
                <a-button type="defalut" class="primary-btn" @click="insertEnter(0)">插入</a-button>
              </div>
              <div style="margin-top: 15px" class="input-group">
                <div class="input-title">段尾</div>
                <div class="input-value">
                  <a-input
                    style="width: 160px"
                    placeholder="请输入待插入的字符"
                    v-model="exportConfig.insert.after"
                  ></a-input>
                </div>
                <a-button type="defalut" class="primary-btn" @click="insertEnter(1)">插入</a-button>
              </div>
            </div>
          </div>
          <div
            v-if="['tmx', 'tbx', 'xliff', 'xlsx'].includes(exportConfig.suffix)"
            style="width: 400px; margin-left: 40px"
            class="setting-group"
          >
            <div class="setting-group-title">语种设置：</div>
            <div class="setting-group-value">
              <div style="margin-top: 15px" class="input-group">
                <div style="width: 100px" class="input-title">原文语种</div>
                <div class="input-value">
                  <!-- <a-input
                    style="width: 160px"
                    placeholder="请输入原文语种"
                    v-model="exportConfig.langObj.source"
                  ></a-input> -->
                  <a-select
                    v-model="exportConfig.langObj.source"
                    style="width: 160px"
                    placeholder="请选择原文语种"
                  >
                    <a-select-option value="zh-HK">
                      中文- 中国香港
                    </a-select-option>
                    <a-select-option value="zh-MO">
                      中文 - 中国澳门
                    </a-select-option>
                    <a-select-option value="zh-CN">
                      中文 -中国
                    </a-select-option>
                    <a-select-option value="zh-TW">
                      中文 -中国台湾
                    </a-select-option>
                    <a-select-option value="en-GB">
                      英语 - 英国
                    </a-select-option>
                    <a-select-option value="en-US">
                      英语 - 美国
                    </a-select-option>
                    <a-select-option value="fr-FR">
                      法语 -法国
                    </a-select-option>
                    <a-select-option value="de-DE">
                      德语 -德国
                    </a-select-option>
                    <a-select-option value="it-IT">
                      意大利语 -意大利
                    </a-select-option>
                    <a-select-option value="ja-JP">
                      日语 -日本
                    </a-select-option>
                    <a-select-option value="ko-KR">
                      韩语 -韩国
                    </a-select-option>
                    <a-select-option value="ru-RU">
                      俄语 -俄国
                    </a-select-option>
                    <a-select-option value="es-ES">
                      西班牙语 -西班牙
                    </a-select-option>
                  </a-select>
                </div>
              </div>
              <div style="margin-top: 15px" class="input-group">
                <div style="width: 100px" class="input-title">译文语种</div>
                <div class="input-value">
                  <!-- <a-input
                    style="width: 160px"
                    placeholder="请输入译文语种"
                    v-model="exportConfig.langObj.target"
                  ></a-input> -->
                  <a-select
                    v-model="exportConfig.langObj.target"
                    style="width: 160px"
                    placeholder="请选择译文语种"
                  >
                    <a-select-option value="zh-HK">
                      中文- 中国香港
                    </a-select-option>
                    <a-select-option value="zh-MO">
                      中文 - 中国澳门
                    </a-select-option>
                    <a-select-option value="zh-CN">
                      中文 -中国
                    </a-select-option>
                    <a-select-option value="zh-TW">
                      中文 -中国台湾
                    </a-select-option>
                    <a-select-option value="en-GB">
                      英语 - 英国
                    </a-select-option>
                    <a-select-option value="en-US">
                      英语 - 美国
                    </a-select-option>
                    <a-select-option value="fr-FR">
                      法语 -法国
                    </a-select-option>
                    <a-select-option value="de-DE">
                      德语 -德国
                    </a-select-option>
                    <a-select-option value="it-IT">
                      意大利语 -意大利
                    </a-select-option>
                    <a-select-option value="ja-JP">
                      日语 -日本
                    </a-select-option>
                    <a-select-option value="ko-KR">
                      韩语 -韩国
                    </a-select-option>
                    <a-select-option value="ru-RU">
                      俄语 -俄国
                    </a-select-option>
                    <a-select-option value="es-ES">
                      西班牙语 -西班牙
                    </a-select-option>
                  </a-select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <a-modal
      v-model="modal.visible"
      title="导出"
      ok-text="确认"
      cancel-text="取消"
      @cancel="hideModal"
      wrapClassName="export-modal"
      @ok="exportOk"
    >
      <div class="input-group">
        <div class="input-title">导出格式</div>
        <div class="input-value">
          <a-select
            v-model="exportConfig.suffix"
            style="width: 320px"
            placeholder="请选择文件保存格式"
          >
            <a-select-option value="txt"> TXT </a-select-option>
            <a-select-option value="tmx"> TMX </a-select-option>
            <a-select-option value="tbx"> TBX </a-select-option>
            <a-select-option value="xliff"> XLIFF </a-select-option>
            <a-select-option value="docx"> WORD </a-select-option>
            <a-select-option value="xlsx"> EXCEL </a-select-option>
          </a-select>
        </div>
      </div>
      <div v-if="exportConfig.suffix === 'txt'" class="input-group">
        <div class="input-title">编码格式</div>
        <div class="input-value">
          <a-select
            v-model="exportConfig.format"
            style="width: 320px"
            placeholder="请选择编码格式"
          >
            <a-select-option value="utf8"> utf-8 </a-select-option>
            <a-select-option value="utf16"> utf-16 </a-select-option>
            <a-select-option value="gbk"> gbk </a-select-option>
          </a-select>
        </div>
      </div>
      <div class="input-group">
        <div class="input-title">原文语种</div>
        <div class="input-value">
          <!-- <a-input
            style="width: 320px"
            placeholder="请输入原文语种"
            v-model="exportConfig.langObj.source"
          ></a-input> -->
          <a-select
            v-model="exportConfig.langObj.source"
            style="width: 320px"
            placeholder="请选择原文语种"
          >
            <a-select-option value="zh-HK"> 中文- 中国香港 </a-select-option>
            <a-select-option value="zh-MO"> 中文 - 中国澳门 </a-select-option>
            <a-select-option value="zh-CN"> 中文 -中国 </a-select-option>
            <a-select-option value="zh-TW"> 中文 -中国台湾 </a-select-option>
            <a-select-option value="en-GB"> 英语 - 英国 </a-select-option>
            <a-select-option value="en-US"> 英语 - 美国 </a-select-option>
            <a-select-option value="fr-FR"> 法语 -法国 </a-select-option>
            <a-select-option value="de-DE"> 德语 -德国 </a-select-option>
            <a-select-option value="it-IT"> 意大利语 -意大利 </a-select-option>
            <a-select-option value="ja-JP"> 日语 -日本 </a-select-option>
            <a-select-option value="ko-KR"> 韩语 -韩国 </a-select-option>
            <a-select-option value="ru-RU"> 俄语 -俄国 </a-select-option>
            <a-select-option value="es-ES"> 西班牙语 -西班牙 </a-select-option>
          </a-select>
        </div>
      </div>
      <div class="input-group">
        <div class="input-title">译文语种</div>
        <div class="input-value">
          <!-- <a-input
            style="width: 320px"
            placeholder="请输入译文语种"
            v-model="exportConfig.langObj.target"
          ></a-input> -->
          <a-select
            v-model="exportConfig.langObj.target"
            style="width: 320px"
            placeholder="请选择原文语种"
          >
            <a-select-option value="zh-HK"> 中文- 中国香港 </a-select-option>
            <a-select-option value="zh-MO"> 中文 - 中国澳门 </a-select-option>
            <a-select-option value="zh-CN"> 中文 -中国 </a-select-option>
            <a-select-option value="zh-TW"> 中文 -中国台湾 </a-select-option>
            <a-select-option value="en-GB"> 英语 - 英国 </a-select-option>
            <a-select-option value="en-US"> 英语 - 美国 </a-select-option>
            <a-select-option value="fr-FR"> 法语 -法国 </a-select-option>
            <a-select-option value="de-DE"> 德语 -德国 </a-select-option>
            <a-select-option value="it-IT"> 意大利语 -意大利 </a-select-option>
            <a-select-option value="ja-JP"> 日语 -日本 </a-select-option>
            <a-select-option value="ko-KR"> 韩语 -韩国 </a-select-option>
            <a-select-option value="ru-RU"> 俄语 -俄国 </a-select-option>
            <a-select-option value="es-ES"> 西班牙语 -西班牙 </a-select-option>
          </a-select>
        </div>
      </div>

      <div class="input-group">
        <div class="input-title">保存路径</div>
        <div class="input-value">
          <a-input
            style="width: 320px"
            placeholder="请选择保存路径"
            :disabled="true"
            v-model="downUrl"
          >
            <div @click="selectFolder" class="selectFolder" slot="addonAfter">
              选择
            </div>
          </a-input>
        </div>
      </div>
    </a-modal>
    <a-modal
      v-model="addModal.visible"
      title="导出"
      ok-text="确认"
      cancel-text="取消"
      @cancel="hideAddModal"
      wrapClassName="export-modal"
      @ok="exportAddOk"
    >
      <div class="input-group">
        <div class="input-title">文件名</div>
        <div class="input-value">
          <a-input
            style="width: 320px"
            :placeholder="addModal.placeholder"
            v-model="addModal.fileName"
          ></a-input>
        </div>
      </div>
      <div class="input-group">
        <div class="input-title">保存路径</div>
        <div class="input-value">
          <a-input
            style="width: 320px"
            placeholder="请选择保存路径"
            :disabled="true"
            v-model="downUrl"
          >
            <div @click="selectFolder" class="selectFolder" slot="addonAfter">
              选择
            </div>
          </a-input>
        </div>
      </div>
    </a-modal>
    <div ref="wordRef" class="wordRef"></div>
  </div>
</template>

<script>
import ExportService from "../tools/exportService.js";
const exportService = new ExportService();
import readline from "readline";
import electron from "electron";
import "../worker/init.js";
import { setTimeout, clearTimeout } from "timers";
import path from "path";
import { ipcRenderer } from "electron";
export default {
  data() {
    const downUrl = this.$db
      .read()
      .get("export.defaultUrl")
      .value();
    return {
      drawer: {
        visible0: false,
        visible1: false,
      },
      downUrl: downUrl || exportService.getDownPath(),
      modal: {
        visible: false,
      },
      addModal: {
        visible: false,
        fileName: "",
        placeholder: "",
      },
      panes: [],
      newTabIndex: 0,
      activeKey: null,
      scrollValue: 0,
      exportConfig: {
        suffix: "txt",
        format: "utf8",
        separate: {
          character: "",
          type: 0,
        },
        langObj: {
          source: "zh-CN",
          target: "en-US",
        },
        lang: {
          isEn: true,
          isZh: true,
        },
        insert: {
          before: "",
          after: "",
        },
      },
    };
  },
  created() {
    this.initWorker();
    this.$bus.on("exitPrve", () => {
      const pane = this.panes.find((d) => d.key == this.activeKey);
      if (pane) {
        const historys = pane.editor.historySize();
        if (historys.undo > 1) {
          pane.editor.undo();
        }
      }
    });
    this.$bus.on("exitNext", () => {
      const pane = this.panes.find((d) => d.key == this.activeKey);
      if (pane) {
        const historys = pane.editor.historySize();
        if (historys.redo !== 0) {
          pane.editor.redo();
        }
      }
    });
    this.$bus.on("searchTxt", (txt) => {
      const pane = this.panes.find((d) => d.key == this.activeKey);
      if (pane) {
        pane.editor.execCommand("find");
      }
    });
    this.$bus.on("replaceTxt", (txt) => {
      const pane = this.panes.find((d) => d.key == this.activeKey);
      if (pane) {
        pane.editor.execCommand("replace");
      }
    });
    let timer = null;
    this.$bus.on("saveFile", () => {
      if (!this.activeKey) {
        return;
      }
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        const pane = this.panes.find((d) => d.key == this.activeKey);
        if (
          [
            "tmx",
            "tbx",
            "xliff",
            "sdlxliff",
            "docx",
            "xlsx",
            "ass",
            "srt",
          ].includes(pane.title.substring(pane.title.lastIndexOf(".") + 1))
        ) {
          this.$message.destroy();
          this.$message.error("结构化数据，不能保存回源文件");
          return false;
        }
        if (pane && pane.path) {
          this.saveFun(
            pane,
            {
              suffix: pane.title.substring(pane.title.lastIndexOf(".") + 1),
              format: "utf8",
              name: pane.title.substring(0, pane.title.lastIndexOf(".")),
              separate: {
                character: "",
                type: 0,
              },
              langObj: {
                source: "zh-CN",
                target: "en-US",
              },
              lang: {
                isEn: true,
                isZh: true,
              },
              insert: {
                before: "",
                after: "",
              },
            },
            pane.path
          );
        } else {
          this.addModal.visible = true;
          this.addModal.placeholder = pane.title;
        }
      }, 200);
    });
  },
  mounted() {
    let timer = null;
    const panes = this.$db
      .read()
      .get("transform.tabs")
      .value();
    const activeKey = this.$db
      .read()
      .get("transform.activeKey")
      .value();
    (panes || []).forEach((item) => {
      item.domRef = "domRef" + item.key;
      const data = this.$dbMap
        .get(item.key)
        .read()
        .get("data")
        .value();
      item = Object.assign(item, data || {});
    });
    this.panes = panes || [];
    this.activeKey = activeKey || (panes && panes.length > 0 && panes[0].key);
    this.initEditor();
    this.initHandles();
    this.$bus.on("export", () => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        if (this.panes.length > 0) {
          this.$message.destroy();
          this.modal.visible = true;
        } else {
          this.$message.destroy();
          this.$message.error("暂无文件导出");
        }
      }, 200);
    });
  },
  watch: {
    $route: {
      handler(to) {
        const panes = this.$db
          .read()
          .get("transform.tabs")
          .value();
        const activeKey = this.$db
          .read()
          .get("transform.activeKey")
          .value();
        this.panes = panes.map((item) => {
          delete item.editor;
          item.domRef = "domRef" + item.key;
          const data = this.$dbMap
            .get(item.key)
            .read()
            .get("data")
            .value();
          item = Object.assign(item, data || {});
          return item;
        });
        this.activeKey = activeKey;
        this.initEditor();
        this.initHandles();
      },
      deep: true,
    },
    activeKey(val) {
      this.$db
        .read()
        .set("transform.activeKey", val)
        .write();
      const pane = this.panes.find((d) => d.key == val);
      if (pane && pane.type && pane.type === "docx") {
        this.$refs.wordRef.innerHTML = pane.html;
      }
      this.initHandles();
    },
  },
  methods: {
    showDrawer(type) {
      this.$ipcRenderer.send('timer.refresh');
      this.drawer["visible" + type] = !this.drawer["visible" + type];
    },
    initWorker() {
      const that = this;
      setTimeout(() => {
        this.$ipcRenderer.send("clearPanes", {
          panes: [],
        });
      }, 2000);
      ipcRenderer.on("message-from-main", (event, arg) => {
        if (arg.action === "clearPanes") {
          that.panes = [];
        }
      });
    },
    initHandles() {
      const pane = this.panes.find((d) => d.key == this.activeKey);
      console.log(this.panes);
      if (this.panes && this.panes.length > 0) {
        this.$bus.emit("disabled", [
          {
            title: "保存",
            disabled: false,
          },
          {
            title: "重做",
            disabled: true,
          },
          {
            title: "撤回",
            disabled: true,
          },
          {
            title: "导出",
            disabled: false,
          },
          {
            title: "替换",
            disabled: false,
          },
          {
            title: "查找",
            disabled: false,
          },
        ]);
      } else {
        this.$bus.emit("disabled", [
          {
            title: "保存",
            disabled: true,
          },
          {
            title: "重做",
            disabled: true,
          },
          {
            title: "撤回",
            disabled: true,
          },
          {
            title: "查找",
            disabled: false,
          },
          {
            title: "替换",
            disabled: false,
          },
        ]);
      }
      if (!(pane && pane.editor)) {
        return;
      }
      const historys = pane.editor.historySize();
      if (historys.undo === 1 || historys.undo === 0) {
        this.$bus.emit("disabled", [
          {
            title: "撤回",
            disabled: true,
          },
          {
            title: "保存",
            disabled: true,
          },
        ]);
      } else {
        this.$bus.emit("disabled", [
          {
            title: "撤回",
            disabled: false,
          },
          {
            title: "保存",
            disabled: false,
          },
        ]);
      }
      if (historys.redo === 0) {
        this.$bus.emit("disabled", [
          {
            title: "重做",
            disabled: true,
          },
        ]);
      } else {
        this.$bus.emit("disabled", [
          {
            title: "重做",
            disabled: false,
          },
        ]);
      }
      if (
        ["tmx", "tbx", "xliff", "sdlxliff", "docx", "xlsx"].includes(
          pane.title.substring(pane.title.lastIndexOf(".") + 1)
        )
      ) {
        this.$bus.emit("disabled", [
          {
            title: "保存",
            disabled: true,
          },
        ]);
      } else {
        this.$bus.emit("disabled", [
          {
            title: "保存",
            disabled: false,
          },
        ]);
      }
    },
    selectFolder() {
      this.$ipcRenderer.send('timer.refresh');
      const url = electron.remote.dialog.showOpenDialogSync({
        properties: ["openDirectory"],
      });
      if (url && url.length > 0) {
        this.downUrl = url[0];
        this.$db.set("export.defaultUrl", url[0]).write();
      }
    },
    changeTab() {
      this.$ipcRenderer.send('timer.refresh');
      this.modal.visible = false;
      this.drawer.visible0 = false;
      this.drawer.visible1 = false;
      this.scrollValue = 0;
    },
    hideModal() {
      this.$ipcRenderer.send('timer.refresh');
      this.modal.visible = false;
    },
    hideAddModal() {
      this.$ipcRenderer.send('timer.refresh');
      this.addModal.visible = false;
    },
    clearSpace() {
      this.$ipcRenderer.send('timer.refresh');
      const pane = this.panes.find((d) => d.key == this.activeKey);
      if (pane) {
        const selectText = pane.editor.getSelection();
        const text = pane.editor.getValue();
        if (selectText) {
          const newTxt = selectText.replace(/( )/g, "");
          this.setEditValue(pane, text.replace(selectText, newTxt));
        } else {
          this.setEditValue(pane, text.replace(/( )/g, ""));
        }
      }
    },
    clearNotes() {
      this.$ipcRenderer.send('timer.refresh');
      const pane = this.panes.find((d) => d.key == this.activeKey);
      let text = pane.editor.getValue();
      if (pane) {
        // this.$refs.
        this.$refs.wordRef.querySelectorAll("ol li").forEach((item) => {
          const oldTxt = item.innerText;
          text = text.replace(oldTxt, "");
        });
        this.$refs.wordRef.removeChild(this.$refs.wordRef.querySelector("ol"));
        this.setEditValue(pane, text);
        this.$message.success("已完成所有脚注、尾注内容的清理");
      }
    },
    clickButtonFile() {
      this.$ipcRenderer.send('timer.refresh');
      this.$bus.emit("openfile");
    },
    exportOk() {
      this.$ipcRenderer.send('timer.refresh');
      const pane = this.panes.find((d) => d.key == this.activeKey);
      this.modal.visible = false;
      this.exportFunc(pane);
    },
    exportAddOk() {
      this.$ipcRenderer.send('timer.refresh');
      const pane = this.panes.find((d) => d.key == this.activeKey);
      this.addModal.visible = false;
      this.panes.forEach((item) => {
        item.title = this.addModal.fileName
          ? this.addModal.fileName + ".txt"
          : pane.title;
        item.path =
          this.downUrl +
          path.sep +
          (this.addModal.fileName ||
            pane.title.substring(0, pane.title.lastIndexOf("."))) +
          ".txt";
      });
      this.$ipcRenderer.send("transformation.changeByKey", {
        key: pane.key,
        data: {
          title: this.addModal.fileName
            ? this.addModal.fileName + ".txt"
            : pane.title,
          path:
            this.downUrl +
            path.sep +
            (this.addModal.fileName ||
              pane.title.substring(0, pane.title.lastIndexOf("."))) +
            ".txt",
        },
      });
      this.saveFun(
        pane,
        {
          suffix: "txt",
          format: "utf8",
          name:
            this.addModal.fileName ||
            pane.title.substring(0, pane.title.lastIndexOf(".")),
          separate: {
            character: "",
            type: 0,
          },
          langObj: {
            source: "zh-CN",
            target: "en-US",
          },
          lang: {
            isEn: true,
            isZh: true,
          },
          insert: {
            before: "",
            after: "",
          },
        },
        this.downUrl +
          path.sep +
          (this.addModal.fileName ||
            pane.title.substring(0, pane.title.lastIndexOf("."))) +
          ".txt"
      );
    },
    clearMark() {
      this.$ipcRenderer.send('timer.refresh');
      const pane = this.panes.find((d) => d.key == this.activeKey);
      let text = pane.editor.getValue();
      if (pane) {
        // this.$refs.
        this.$refs.wordRef.querySelectorAll("sup").forEach((item) => {
          const parentDom = item.parentElement;
          const oldTxt = parentDom.innerText;
          parentDom.removeChild(item);
          const newTxt = parentDom.innerText;
          text = text.replace(oldTxt, newTxt);
        });

        this.setEditValue(pane, text);
        this.$message.success("已完成所有上标、下标符号的清理");
      }
    },
    saveFun(pane, config, savePath) {
      this.$ipcRenderer.send('timer.refresh');
      switch (config.suffix) {
        case "tmx":
          exportService
            .exportTmx(config, pane.editor.getValue(), savePath, true)
            .then(({ name, path }) => {
              this.$notification.success({
                message: "导出成功",
                duration: 5,
                description: name + "文件已导出文件夹:[ " + path + " ]",
              });
            });
          break;
        case "tbx":
          exportService
            .exportTbx(config, pane.editor.getValue(), savePath, true)
            .then(({ name, path }) => {
              this.$notification.success({
                message: "导出成功",
                duration: 5,
                description: name + "文件已导出文件夹:[ " + path + " ]",
              });
            });
          break;
        case "txt":
          exportService
            .exportTxt(config, pane.editor.getValue(), savePath, true)
            .then(({ name, path }) => {
              this.$notification.success({
                message: "导出成功",
                duration: 5,
                description: name + "文件已导出文件夹:[ " + path + " ]",
              });
            });
          break;
        case "docx":
          exportService
            .exportDocx(config, pane.editor.getValue(), savePath, true)
            .then(({ name, path }) => {
              this.$notification.success({
                message: "导出成功",
                duration: 5,
                description: name + "文件已导出文件夹:[ " + path + " ]",
              });
            });
          break;
        case "xliff":
          exportService
            .exportXliff(config, pane.editor.getValue(), savePath, true)
            .then(({ name, path }) => {
              this.$notification.success({
                message: "导出成功",
                duration: 5,
                description: name + "文件已导出文件夹:[ " + path + " ]",
              });
            });
          break;
        case "xlsx":
          exportService
            .exportXlsx(config, pane.editor.getValue(), savePath, true)
            .then(({ name, path }) => {
              this.$notification.success({
                message: "导出成功",
                duration: 5,
                description: name + "文件已导出文件夹:[ " + path + " ]",
              });
            });
          break;
      }
    },
    exportFunc(pane) {
      this.$ipcRenderer.send('timer.refresh');
      this.exportConfig.name = pane.title.substring(
        0,
        pane.title.lastIndexOf(".")
      );
      switch (this.exportConfig.suffix) {
        case "tmx":
          exportService
            .exportTmx(this.exportConfig, pane.editor.getValue(), this.downUrl)
            .then(({ name, path }) => {
              this.$notification.success({
                message: "导出成功",
                duration: 5,
                description: name + "文件已导出文件夹:[ " + path + " ]",
              });
            });
          break;
        case "tbx":
          exportService
            .exportTbx(this.exportConfig, pane.editor.getValue(), this.downUrl)
            .then(({ name, path }) => {
              this.$notification.success({
                message: "导出成功",
                duration: 5,
                description: name + "文件已导出文件夹:[ " + path + " ]",
              });
            });
          break;
        case "txt":
          exportService
            .exportTxt(this.exportConfig, pane.editor.getValue(), this.downUrl)
            .then(({ name, path }) => {
              this.$notification.success({
                message: "导出成功",
                duration: 5,
                description: name + "文件已导出文件夹:[ " + path + " ]",
              });
            });
          break;
        case "docx":
          exportService
            .exportDocx(this.exportConfig, pane.editor.getValue(), this.downUrl)
            .then(({ name, path }) => {
              this.$notification.success({
                message: "导出成功",
                duration: 5,
                description: name + "文件已导出文件夹:[ " + path + " ]",
              });
            });
          break;
        case "xliff":
          exportService
            .exportXliff(
              this.exportConfig,
              pane.editor.getValue(),
              this.downUrl
            )
            .then(({ name, path }) => {
              this.$notification.success({
                message: "导出成功",
                duration: 5,
                description: name + "文件已导出文件夹:[ " + path + " ]",
              });
            });
          break;
        case "xlsx":
          exportService
            .exportXlsx(this.exportConfig, pane.editor.getValue(), this.downUrl)
            .then(({ name, path }) => {
              this.$notification.success({
                message: "导出成功",
                duration: 5,
                description: name + "文件已导出文件夹:[ " + path + " ]",
              });
            });
          break;
      }
    },
    mergeEnter(type) {
      this.$ipcRenderer.send('timer.refresh');
      const pane = this.panes.find((d) => d.key == this.activeKey);
      if (pane) {
        const selectText = pane.editor.getSelection();
        const text = pane.editor.getValue();
        if ([0, 1].includes(type)) {
          const reg = type === 0 ? /(\n)+/g : /(\r)+/g;
          if (selectText) {
            const newText = selectText.replace(reg, " ");
            // const resultTxt = text.replace(selectText, newText);
            // pane.editor.setValue(resultTxt);
            // this.setEditValue(pane, resultTxt);
            pane.editor.replaceSelection(newText);
          } else {
            // pane.editor.setValue(text.replace(reg, ""));
            this.setEditValue(pane, text.replace(reg, " "));
          }
        } else {
          const reg = /[0-9](、|.)|\w+、|(\(|（)[0-9]+(\)|）)、?|[\u4e00-\u9fa5\u767e\u5343\u96f6]{1,10}、/gm;
          if (selectText) {
            const newText = selectText.replace(reg, (item) => {
              console.log(item);
              return "\n" + item;
            });
            const resultTxt = text.replace(selectText, newText);
            // pane.editor.setValue(resultTxt);
            this.setEditValue(pane, resultTxt);
          } else {
            this.setEditValue(
              pane,
              text.replace(reg, (item) => {
                return "\n" + item;
              })
            );
            // pane.editor.setValue(
            //   text.replace(reg, (item) => {
            //     return "\n" + item;
            //   })
            // );
          }
        }
      }
      this.$message.success(
        type === 0
          ? "已完成回车分段合并"
          : type === 1
          ? "已完成回车分段合并"
          : "已完成"
      );
    },
    changeChart(type) {
      this.$ipcRenderer.send('timer.refresh');
      const pane = this.panes.find((d) => d.key == this.activeKey);
      if (pane) {
        const selectText = pane.editor.getSelection();
        const text = pane.editor.getValue();
        let reg = null;
        if (type === "ToDBC") {
          // 半角转全角%
          reg = /[\x21-\x2f\x3a-\x40\x5b-\x60\x7B-\x7F]/g;
        } else {
          reg = /[\u3002|\uff1f|\uff01]|\uff0c|\u3001|\uff1b|\uff1a|\u300c|\u300d|\u300e|\u2018|\u2019|\u201c|\u201d|\uff08|\uff09|\u3014|\u3015|\u3010|\u3011|\u2014|\u2026|\u2013|\uff0e|\u300a|\u300b|\u3008|\u3009/g;
        }
        if (selectText) {
          // this[type](selectText)
          const newText = selectText.replace(reg, (item) => {
            return this[type](item);
          });
          pane.editor.replaceSelection(newText);
          // const resultTxt = text.replace(selectText, newText);
          // this.setEditValue(pane, resultTxt);
          // pane.editor.setValue(resultTxt);
        } else {
          const resultTxt = text.replace(reg, (item) => {
            return this[type](item);
          });
          // pane.editor.setValue(resultTxt);
          this.setEditValue(pane, resultTxt);
          this.$message.success(
            type === "ToCDB" ? "已全部转成半角符号" : "已全部转成全角符号"
          );
        }
      }
    },
    // 全角转半角
    ToCDB(str) {
      this.$ipcRenderer.send('timer.refresh');
      var tmp = "";
      for (var i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 65248 && str.charCodeAt(i) < 65375) {
          tmp += String.fromCharCode(str.charCodeAt(i) - 65248);
        } else {
          tmp += String.fromCharCode(str.charCodeAt(i));
        }
      }
      return tmp;
    },
    ToDBC(txtstring) {
      this.$ipcRenderer.send('timer.refresh');
      var tmp = "";
      for (var i = 0; i < txtstring.length; i++) {
        if (txtstring.charCodeAt(i) == 32) {
          tmp = tmp + String.fromCharCode(12288);
        } else if (txtstring.charCodeAt(i) < 127) {
          tmp = tmp + String.fromCharCode(txtstring.charCodeAt(i) + 65248);
        }
      }
      return tmp;
    },
    toUpperCase() {
      this.$ipcRenderer.send('timer.refresh');
      const pane = this.panes.find((d) => d.key == this.activeKey);
      if (pane) {
        const selectText = pane.editor.getSelection();
        const text = pane.editor.getValue();
        if (selectText) {
          const newText = selectText.toUpperCase();
          pane.editor.replaceSelection(newText);
          // const resultTxt = text.replace(selectText, newText);
          // pane.editor.setValue(resultTxt);
          // this.setEditValue(pane, resultTxt);
        } else {
          // pane.editor.setValue(text.toUpperCase());
          this.setEditValue(pane, text.toUpperCase());
          this.$message.success("已全部转成全大写");
        }
      }
    },
    toLowerCase() {
      this.$ipcRenderer.send('timer.refresh');
      const pane = this.panes.find((d) => d.key == this.activeKey);
      if (pane) {
        const selectText = pane.editor.getSelection();
        const text = pane.editor.getValue();
        if (selectText) {
          const newText = selectText.toLowerCase();
          pane.editor.replaceSelection(newText);
          // const resultTxt = text.replace(selectText, newText);
          // pane.editor.setValue(resultTxt);
          // this.setEditValue(pane, resultTxt);
        } else {
          // pane.editor.setValue(text.toLowerCase());
          this.setEditValue(pane, text.toLowerCase());
          this.$message.success("已全部转成全小写");
        }
      }
    },
    clearPBefore() {
      this.$ipcRenderer.send('timer.refresh');
      const pane = this.panes.find((d) => d.key == this.activeKey);
      if (pane) {
        const selectText = pane.editor.getSelection();
        const text = pane.editor.getValue();
        if (selectText) {
          const newText = selectText.replace(
            /^\s*[0-9]+(、|\.)|^\s*\w+、|^\s*(\(|（)[0-9]+(\)|）)、?|^\s*[\u4e00-\u9fa5\u767e\u5343\u96f6]{1,10}、/gm,
            (regTxt) => {
              return regTxt.replace(
                /[0-9](、|.)|^\w+、|(\(|（)[0-9]+(\)|）)、?|[\u4e00-\u9fa5\u767e\u5343\u96f6]{1,10}、/,
                ""
              );
            }
          );
          pane.editor.replaceSelection(newText);
          // const resultTxt = text.replace(selectText, newText);
          // pane.editor.setValue(resultTxt);
          // this.setEditValue(pane, resultTxt);
        } else {
          const newTxt = text.replace(
            /^\s*[0-9]+(、|\.)|^\s*\w+、|^\s*(\(|（)[0-9]+(\)|）)、?|^\s*[\u4e00-\u9fa5\u767e\u5343\u96f6]{1,10}、/gm,
            (regTxt) => {
              return regTxt.replace(
                /[0-9](、|.)|^\w+、|(\(|（)[0-9]+(\)|）)、?|[\u4e00-\u9fa5\u767e\u5343\u96f6]{1,10}、/,
                ""
              );
            }
          );
          // pane.editor.setValue(newTxt);
          this.setEditValue(pane, newTxt);
          this.$message.success("已完成段首编号的清理");
        }
      }
    },
    clearEnter() {
      this.$ipcRenderer.send('timer.refresh');
      const pane = this.panes.find((d) => d.key == this.activeKey);
      if (pane) {
        const selectText = pane.editor.getSelection();
        const text = pane.editor.getValue();
        if (selectText) {
          const newText = selectText
            .replace(/(\n[\s\t]*\r*\n)/g, "\n")
            .replace(/^[\n\r\n\t]*|[\n\r\n\t]*$/g, "");
          pane.editor.replaceSelection(newText);
          // const resultTxt = text.replace(selectText, newText);
          // pane.editor.setValue(resultTxt);
          // this.setEditValue(pane, resultTxt);
          // pane.editor.replaceSelection(resultTxt);
        } else {
          const newText = text
            .replace(/(\n[\s\t]*\r*\n)/g, "\n")
            .replace(/^[\n\r\n\t]*|[\n\r\n\t]*$/g, "");
          // pane.editor.setValue(newText);
          this.setEditValue(pane, newText);
        }
        this.$message.success("已完成所有空白行的清理");
      }
    },
    initEditor() {
      const panes = this.panes;
      this.panes = [];
      setTimeout(() => {
        this.panes = panes;
        setTimeout(() => {
          this.panes.forEach((item) => {
            let dom = null;
            console.log(item, this.$refs["domRef" + item.key]);
            if (this.$refs["domRef" + item.key]) {
              if (Array.isArray(this.$refs["domRef" + item.key])) {
                dom = this.$refs["domRef" + item.key][0];
              } else {
                dom = this.$refs["domRef" + item.key];
              }
              console.log(window.CodeMirror);
              item.editor = window.CodeMirror.fromTextArea(dom, {
                lineNumbers: true, // 显示行数
                lineWrapping: true,
                indentUnit: 4, // 缩进单位为4
                styleActiveLine: true, // 当前行背景高亮
                onCursorActivity: (instance) => {
                  console.log(instance);
                },
              });
              if (item.type === "docx") {
                this.$refs.wordRef.innerHTML = item.html;
              }
              item.editor.setValue(item.content || "");
              item.editor.save();
              let timer = null;
              item.editor.on("change", (Editor, changes) => {
                this.$ipcRenderer.send('timer.refresh');
                if (timer) {
                  clearTimeout(timer);
                }
                timer = setTimeout(() => {
                  // item.editor.addToHistory(true);
                  this.$ipcRenderer.send("transformation.changeByKey", {
                    key: item.key,
                    data: {
                      content: item.editor.getValue(),
                      html:
                        item.type === "docx"
                          ? this.$refs.wordRef.innerHTML
                          : undefined,
                    },
                  });
                  this.$nextTick(() => {
                    this.initHandles();
                  });
                }, 1000);
              });
              item.isEditor = true;
            }
          });
        }, 20);
      });
    },
    setEditValue(pane, content) {
      const scrollTop = pane.editor.display.scroller.scrollTop;
      pane.editor.setValue(content);
      setTimeout(() => {
        pane.editor.display.scroller.scrollTop = scrollTop;
      });
    },
    insertSp() {
      this.$ipcRenderer.send('timer.refresh');
      const pane = this.panes.find((d) => d.key == this.activeKey);
      if (pane) {
        const text = pane.editor.getValue();
        if (pane.editor.getSelection()) {
          const strt = pane.editor.getSelection();
          const newStr = pane.editor
            .getSelection()
            .replace(/[\u4e00-\u9fa5]+/g, (word) => word.split("").join(" "));
          // const result = text.replace(strt, newStr);
          // pane.editor.setValue(result);
          // this.setEditValue(pane, result);
          pane.editor.replaceSelection(newStr);
        } else {
          //   const d = text.replace(text, text.replace(/( |    )+/g, ""))
          const ary = text.split("\n");
          const result = ary.map((item) => {
            return item.replace(/[\u4e00-\u9fa5]+/g, (word) =>
              word.split("").join(" ")
            );
          });
          this.setEditValue(pane, result.join("\n"));
          this.$message.success("已完成所有空格的插入");
          // pane.editor.setValue(result.join("\n"));
        }
      }
    },
    insertEnter(type) {
      this.$ipcRenderer.send('timer.refresh');
      const pane = this.panes.find((d) => d.key == this.activeKey);
      if (pane) {
        const text = pane.editor.getValue();
        //   const d = text.replace(text, text.replace(/( |    )+/g, ""))
        const ary = text.split("\n");
        const result = ary.map((item) => {
          if (item) {
            if (type == 0) {
              item = this.exportConfig.insert.before + item;
            } else {
              item = item + this.exportConfig.insert.after;
            }
          }
          return item;
        });
        // console.log(result);
        this.setEditValue(pane, result.join("\n"));
        // pane.editor.setValue(result.join("\n"));
      }

      // text.
    },
    deleteEnter(type) {
      this.$ipcRenderer.send('timer.refresh');
      const pane = this.panes.find((d) => d.key == this.activeKey);
      if (pane) {
        const text = pane.editor.getValue();
        if (type == 0) {
          const text = pane.editor.getValue();
          if (pane.editor.getSelection()) {
            const selectText = pane.editor.getSelection();
            const str = selectText.replace(/^(.*)+\S+/gm, (item) => {
              // console.log(item);
              return item.trim();
            });
            this.setEditValue(pane, text.replace(selectText, str));
          } else {
            const str = text.replace(/^(.*)+\S+/gm, (item) => {
              // console.log(item);
              return item.trim();
            });
            console.log(str);
            this.setEditValue(pane, str);
          }
          this.$message.success(
            type === 0 ? "已完成所有段首空白的清理" : "已完成所有段尾空白的清理"
          );
          return;
        } else {
          const text = pane.editor.getValue();
          if (pane.editor.getSelection()) {
            const selectText = pane.editor.getSelection();
            const str = selectText.replace(/( | )+$/gm, (item) => {
              // console.log(item);
              return item.trim();
            });
            this.setEditValue(pane, text.replace(selectText, str));
          } else {
            const str = text.replace(/( | )+$/gm, (item) => {
              // console.log(item);
              return item.trim();
            });
            this.setEditValue(pane, str);
          }

          this.$message.success(
            type === 0 ? "已完成所有段首空白的清理" : "已完成所有段尾空白的清理"
          );
          return;
        }
      }
    },
    getSelectText(pane) {
      console.log(pane.editor.getSelection());
    },
    callback(key) {
      console.log(key);
    },
    onEdit(targetKey, action) {
      this[action](targetKey);
    },
    add() {
      this.$ipcRenderer.send('timer.refresh');
      const panes = this.panes;
      const key = new Date().getTime();
      const activeKey = key;
      panes.push({
        title: `Untitled-${this.panes.length + 1}.txt`,
        domRef: "domRef" + activeKey,
        key: activeKey,
      });
      this.$dbMap
        .add(activeKey)
        .get(activeKey)
        .set("data", {
          content: "",
        })
        .write();
      this.activeKey = activeKey;
      const result = panes.map((item) => {
        delete item.editor;
        return item;
      });
      this.panes = result;
      this.$db.set("transform.activeKey", activeKey).write();
      this.$db.set("transform.tabs", result).write();
      setTimeout(() => {
        this.initEditor();
      }, 50);
    },
    remove(targetKey) {
      this.$ipcRenderer.send('timer.refresh');
      let activeKey = this.activeKey;
      try {
        this.$dbMap.delete(targetKey);
      } catch (e) {}
      let lastIndex;
      this.panes.forEach((pane, i) => {
        if (pane.key === targetKey) {
          lastIndex = i - 1;
        }
      });
      const panes = this.panes.filter((pane) => pane.key !== targetKey);
      if (panes.length && activeKey === targetKey) {
        if (lastIndex >= 0) {
          activeKey = panes[lastIndex].key;
        } else {
          activeKey = panes[0].key;
        }
      }
      this.panes = panes;
      this.activeKey = activeKey;
      const result = panes.map((item) => {
        delete item.editor;
        return item;
      });
      this.drawer.visible0 = false;
      this.drawer.visible1 = false;
      this.initHandles();
      this.initEditor();
      this.$db.set("transform.activeKey", activeKey).write();
      this.$db.set("transform.tabs", result).write();
    },
  },
};
</script>
<style lang="scss">
.export-modal {
  .selectFolder {
    cursor: pointer;
  }
  .input-group {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    .input-title {
      padding-right: 15px;
      width: 100px;
    }
  }
}
</style>

<style lang="scss" scoped>
.transformation-edit {
  background: #ffffff;
  height: 100%;
  overflow: hidden;
  //   overflow-y: auto;
  padding: 8px;
  position: relative;
  // min-width: 800px;
  box-shadow: 0px 2px 8px 0px rgba(230, 230, 230, 0.35);
  #transformation-edit {
    position: absolute;
    padding: 10px;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
  }
  .drawer-icon-show {
    .drawer-show-top {
      position: fixed;
      z-index: 102;
      right: 0;
      top: 210px;
      height: 40px;
      width: 20px;
      background: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border-right: 0px;
    }
    .drawer-show-bottom {
      position: fixed;
      z-index: 102;
      right: 20px;
      bottom: 0px;
      height: 20px;
      width: 40px;
      background: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border-bottom: 0px;
    }
  }
  .icon-close {
    border: 1px solid #1890ff;
  }
  .drawer-class {
    position: absolute;
    padding: 10px;
    background: #ffffff;
    z-index: 101;
    border: 1px solid #eee;
    border-radius: 5px;
    // box-shadow: -6px 0 6px -4px rgba(0 0 0 / 15%);
    .icon-close-bottom {
      right: 20px;
      position: absolute;
      top: 0px;
      height: 20px;
      width: 40px;
      // background: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border: 0px;
    }
    .icon-close-top {
      top: 0px;
      cursor: pointer;
      position: absolute;
      left: 0px;
      height: 40px;
      width: 20px;
      // background: #ffffff;
      border: 0px;
      display: flex;
      align-items: center;
      justify-content: center;
      &:hover {
        color: #1890ff;
      }
    }
    &.drawer-top-class {
      // width: 150px;
      height: 100%;
      top: 0;
      right: 0;
      box-shadow: -6px 0 6px -4px rgba(230, 230, 230, 0.35);
      // box-shadow: -6px 0 6px -4px rgba(14, 176, 201, 0.35);

      .handle-texts {
        overflow: hidden;
        transition: all 0.2s;
      }
    }
    &.drawer-bottom-class {
      width: 100%;
      bottom: 0px;
      left: 0px;
      // box-shadow: 0 -6px 6px -4px rgba(14, 176, 201, 0.35);
      box-shadow: 0 -6px 6px -4px rgba(230, 230, 230, 0.35);
    }
  }
  .code-textarea-div {
    height: 100%;
    overflow: hidden;
    overflow-y: auto;
  }
  .empty {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    .upload-container {
      height: 300px;
      width: 100%;
      background: #ffffff;
      cursor: pointer;
      margin-top: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      position: relative;
      .changeUploadType {
        position: absolute;
        right: 20px;
        bottom: 20px;
      }
      .icon {
        img {
          width: 100px;
        }
      }
      .title {
        color: #303845;
      }
    }
  }
  .input-group {
    display: flex;
    align-items: center;
    .input-title {
      padding-right: 15px;
    }
  }
  .setting {
    display: flex;
    flex-direction: column;
    min-width: 800px;
    overflow: hidden;
    transition: all 0.2s;
    .setting-title {
      color: #303845;
      font-weight: 500;
      font-size: 18px;
      margin-bottom: 5px;
    }
    .setting-body {
      flex: 1;
      display: flex;
      .setting-group + .setting-group {
        margin-left: 20px;
      }
      .setting-group {
        display: flex;
        flex-direction: column;
        width: 120px;
        .setting-group-title {
          color: #303845;
          font-weight: 400;
        }
        .setting-group-value {
          flex: 1;
          .primary-btn {
            margin-left: 20px;
            width: 82px;
            height: 32px;
            border-radius: 4px;
            color: rgba(1, 171, 240, 100);
            font-size: 14px;
            text-align: center;
            border: 1px solid rgba(1, 171, 240, 100);
          }
        }
      }
    }
  }
  .wordRef {
    width: 0;
    height: 0;
    overflow: hidden;
  }
  .handle-btn {
    font-size: 11px;
    padding: 4px;
  }
  .handle-texts {
    width: 100%;
    .handle-group {
      width: 100%;
      margin-top: 20px;
      .handle-group-title {
        color: #303845;
        white-space: nowrap;
        font-weight: 500;
      }
      .handle-group-body {
        width: 100%;
        .handle-btn {
          margin-top: 8px;
          width: 100%;
        }
      }
    }
  }
  .handle-setting {
    height: 40px;
    white-space: nowrap;
    // border-top: 1px solid #e8e8e8;
    border-bottom: 1px solid #e8e8e8;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 300;
    width: 100%;
    background: #ffffff;
    .handle-icons {
      flex: 1;
      overflow: hidden;
      overflow-x: auto;
    }
  }
  .code-textarea {
    overflow: hidden;
    background: transparent;
    width: 0;
    height: 0;
    resize: none;
    border: 0;
    padding: 0;
    margin: 0;
  }
  .pane-body {
    height: 100%;
    overflow: hidden;
    position: relative;
    // padding-top: 55px;
  }
  .textarea {
    width: 100%;
    height: 100%;
  }
  .search-replace {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 400;
  }
}
</style>
