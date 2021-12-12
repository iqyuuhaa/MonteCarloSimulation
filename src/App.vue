<script>
  export default {
    data: function() {
      return {
        is_passed: 0,
        sample_data_count: null,
        prediction_count: null,
        total_value: 0,
        dataValue: [],
        iteration_index: [],
        random_value: []
      };
    },
    computed: {
      sampleDataCount: function() {
        var total = 0;
        if (this.sample_data_count != null) {
          total = parseInt(this.sample_data_count);
        }

        return total;
      },
      predictionCount: function() {
        var total = 0;
        if (this.prediction_count != null) {
          total = parseInt(this.prediction_count);
        }

        return total;
      },
    },
    watch: {
      sample_data_count: function(value) {
        this.dataValue = [];
        this.is_passed = 0;

        var total = 0;
        if (value != null) {
          total = parseInt(value);
        }

        for (let i = 0; i < total; i++) {
          this.dataValue.push({
            'label': null,
            'value': null,
            'total_probabilitas': 0,
            'total_kumulatif': 0,
            'start_interval': 0,
            'end_interval': 0
          });
        }
      },
    },
    methods: {
      checkValue: async function() {
        var isPassed = 1;
        var totalValue = 0;
        var iterationIndex = [];
        var randomValue = [];

        await this.dataValue.forEach((value) => {
          totalValue += parseFloat(value.value);

          if (!this.sample_data_count || !this.prediction_count || !value.label || !value.value) {
            isPassed = 0;
          }
        });

        await this.dataValue.forEach((value, index) => {
          value.total_probabilitas = Math.round(parseFloat(value.value) / totalValue * 1000) / 1000;
          value.total_kumulatif = index == 0 ? value.total_probabilitas : Math.round((this.dataValue[index-1].total_kumulatif + value.total_probabilitas) * 1000) / 1000;
          value.start_interval = index == 0 ? 1 : this.dataValue[index-1].total_kumulatif * 1000;
          value.end_interval = value.total_kumulatif * 1000 - 1;
        });

        if (this.sample_data_count && this.prediction_count) {
          for (var i = 0; i < this.prediction_count; i++) {
            var resultA = i % this.sample_data_count;
            iterationIndex.push(resultA);
          }

          iterationIndex = iterationIndex.sort(function(a, b) {
            return b - a;
          });

          for (var j = 0; j < this.prediction_count; j++) {
            var resultB = Math.round(Math.random() * (this.dataValue[iterationIndex[j]].end_interval - this.dataValue[iterationIndex[j]].start_interval) + this.dataValue[iterationIndex[j]].start_interval);
            randomValue.push(resultB);
          }
        }

        this.is_passed = isPassed;
        this.total_value = totalValue;
        this.iteration_index = iterationIndex;
        this.random_value = randomValue;
      }
    }
  }
</script>

<template>
  <div id="app">
    <v-app>
      <v-form>
        <v-container>
          <v-row>
            <v-col cols="12">
              <h1 class="text-center">Monte Carlo Simulations</h1>
            </v-col>
            <v-col cols="6">
              <v-text-field v-model="sample_data_count" outlined label="Jumlah Sampel Data" type="number"></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field v-model="prediction_count" outlined label="Jumlah Output" type="number" @change="checkValue"></v-text-field>
            </v-col>
            <template v-for="(value, index) in sampleDataCount">
              <v-col cols="12" :key="index">
                <v-row>
                  <v-col cols="6">
                    <v-text-field v-model="dataValue[index].label" outlined :label="'Label Sampel Data ' + (index+1)"></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field v-model="dataValue[index].value" outlined :label="'Value Sampel Data ' + (index+1)" type="number" @change="checkValue"></v-text-field>
                  </v-col>
                </v-row>
              </v-col>
            </template>
            <v-col cols="12" class="mb-5">
              <div v-if="is_passed == 1">
                <h4 class="text-center mb-4">Pembahasan</h4>
                <template>
                  <v-expansion-panels>
                    <v-expansion-panel v-for="(item, i) in 5" :key="i">
                      <v-expansion-panel-header><b>Langkah {{ i + 1 }}</b></v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <div v-if="i == 0">
                          <p>Membuat distribusi probabilitas dari sampel data</p>
                          <v-data-iterator :items="dataValue" disable-filtering disable-pagination disable-sort hide-default-footer>
                            <template v-slot:default="props">
                              <v-row>
                                <v-col cols="6">
                                  <v-card color="purple darken-3">
                                    <v-card-title class="subheading font-weight-bold white--text">Sample Data</v-card-title>
                                    <v-divider></v-divider>
                                    <v-list dense>
                                      <v-list-item v-for="(item, index) in props.items" :key="index">
                                        <v-list-item-content><b>{{ item.label }}</b></v-list-item-content>
                                        <v-list-item-content class="align-end">
                                          {{ item.value }}
                                        </v-list-item-content>
                                      </v-list-item>
                                    </v-list>
                                  </v-card>
                                </v-col>
                                <v-col cols="6">
                                  <v-card color="indigo darken-5">
                                    <v-card-title class="subheading font-weight-bold white--text">Distribusi Probabilitas</v-card-title>
                                    <v-divider></v-divider>
                                    <v-list dense>
                                      <v-list-item v-for="(item, index) in props.items" :key="index">
                                        <v-list-item-content><b>{{ item.label }}</b></v-list-item-content>
                                        <v-list-item-content><b>{{ item.value }}/{{ total_value }}</b></v-list-item-content>
                                        <v-list-item-content class="align-end">
                                          {{ item.total_probabilitas }}
                                        </v-list-item-content>
                                      </v-list-item>
                                    </v-list>
                                  </v-card>
                                </v-col>
                              </v-row>
                            </template>
                          </v-data-iterator>
                        </div>
                        <div v-if="i == 1">
                          <p>Membuat distribusi kumulatif dari sampel data</p>
                          <v-data-iterator :items="dataValue" disable-filtering disable-pagination disable-sort hide-default-footer>
                            <template v-slot:default="props">
                              <v-row>
                                <v-col cols="6">
                                  <v-card color="purple darken-3">
                                    <v-card-title class="subheading font-weight-bold white--text">Distribusi Probabilitas</v-card-title>
                                    <v-divider></v-divider>
                                    <v-list dense>
                                      <v-list-item v-for="(item, index) in props.items" :key="index">
                                        <v-list-item-content><b>{{ item.label }}</b></v-list-item-content>
                                        <v-list-item-content><b>{{ item.value }}/{{ total_value }}</b></v-list-item-content>
                                        <v-list-item-content class="align-end">
                                          {{ item.total_probabilitas }}
                                        </v-list-item-content>
                                      </v-list-item>
                                    </v-list>
                                  </v-card>
                                </v-col>
                                <v-col cols="6">
                                  <v-card color="indigo darken-5">
                                    <v-card-title class="subheading font-weight-bold white--text">Distribusi Kumulatif</v-card-title>
                                    <v-divider></v-divider>
                                    <v-list dense>
                                      <v-list-item v-for="(item, index) in props.items" :key="index">
                                        <v-list-item-content><b>{{ item.label }}</b></v-list-item-content>
                                        <v-list-item-content><b>{{ Math.round(parseFloat(item.value) / total_value * 1000) / 1000 }}</b></v-list-item-content>
                                        <v-list-item-content class="align-end">
                                          {{ item.total_kumulatif }}
                                        </v-list-item-content>
                                      </v-list-item>
                                    </v-list>
                                  </v-card>
                                </v-col>
                              </v-row>
                            </template>
                          </v-data-iterator>
                        </div>
                        <div v-if="i == 2">
                          <p>Membuat interval untuk generate angka acak</p>
                          <v-data-iterator :items="dataValue" disable-filtering disable-pagination disable-sort hide-default-footer>
                            <template v-slot:default="props">
                              <v-row>
                                <v-col cols="6">
                                  <v-card color="purple darken-3">
                                    <v-card-title class="subheading font-weight-bold white--text">Data Distribusi Probabilitas & Kumulatif</v-card-title>
                                    <v-divider></v-divider>
                                    <v-list dense>
                                      <v-list-item v-for="(item, index) in props.items" :key="index">
                                        <v-list-item-content><b>{{ item.label }}</b></v-list-item-content>
                                        <v-list-item-content><b>{{ item.total_probabilitas }}</b></v-list-item-content>
                                        <v-list-item-content class="align-end">
                                          {{ item.total_kumulatif }}
                                        </v-list-item-content>
                                      </v-list-item>
                                    </v-list>
                                  </v-card>
                                </v-col>
                                <v-col cols="6">
                                  <v-card color="indigo darken-5">
                                    <v-card-title class="subheading font-weight-bold white--text">Interval Angka Acak</v-card-title>
                                    <v-divider></v-divider>
                                    <v-list dense>
                                      <v-list-item v-for="(item, index) in props.items" :key="index">
                                        <v-list-item-content><b>{{ item.label }}</b></v-list-item-content>
                                        <v-list-item-content class="align-end">
                                          {{ item.start_interval }} - {{ item.end_interval }}
                                        </v-list-item-content>
                                      </v-list-item>
                                    </v-list>
                                  </v-card>
                                </v-col>
                              </v-row>
                            </template>
                          </v-data-iterator>
                        </div>
                        <div v-if="i == 3">
                          <p>Membangkitkan angka acak</p>
                          <v-data-iterator :items="dataValue" disable-filtering disable-pagination disable-sort hide-default-footer>
                            <template v-slot:default="props">
                              <v-row>
                                <v-col cols="6">
                                  <v-card color="purple darken-3">
                                    <v-card-title class="subheading font-weight-bold white--text">Data Interval</v-card-title>
                                    <v-divider></v-divider>
                                    <v-list dense>
                                      <v-list-item v-for="(item, index) in props.items" :key="index">
                                        <v-list-item-content><b>{{ item.label }}</b></v-list-item-content>
                                        <v-list-item-content class="align-end">
                                          {{ item.start_interval }} - {{ item.end_interval }}
                                        </v-list-item-content>
                                      </v-list-item>
                                    </v-list>
                                  </v-card>
                                </v-col>
                                <v-col cols="6">
                                  <v-card color="indigo darken-5">
                                    <v-card-title class="subheading font-weight-bold white--text">Angka Acak</v-card-title>
                                    <v-divider></v-divider>
                                    <v-list dense>
                                      <v-list-item v-for="i in predictionCount" :key="i">
                                        <v-list-item-content><b>{{ +props.items[props.items.length - 1].label !== +props.items[props.items.length - 1].label ? props.items[props.items.length - 1].label + ' ' + i : parseFloat(props.items[props.items.length - 1].label) + parseFloat(i) }}</b></v-list-item-content>
                                        <v-list-item-content><b>{{ props.items[iteration_index[i - 1]].start_interval }} - {{ props.items[iteration_index[i - 1]].end_interval }}</b></v-list-item-content>
                                        <v-list-item-content class="align-end">
                                          {{ random_value[i - 1] }}
                                        </v-list-item-content>
                                      </v-list-item>
                                    </v-list>
                                  </v-card>
                                </v-col>
                              </v-row>
                            </template>
                          </v-data-iterator>
                        </div>
                        <div v-if="i == 4">
                          <p>Membangkitkan angka acak</p>
                          <v-data-iterator :items="dataValue" disable-filtering disable-pagination disable-sort hide-default-footer>
                            <template v-slot:default="props">
                              <v-row>
                                <v-col cols="6">
                                  <v-card color="purple darken-3">
                                    <v-card-title class="subheading font-weight-bold white--text">Data Interval</v-card-title>
                                    <v-divider></v-divider>
                                    <v-list dense>
                                      <v-list-item v-for="(item, index) in props.items" :key="index">
                                        <v-list-item-content><b>{{ item.label }}</b></v-list-item-content>
                                        <v-list-item-content class="align-end">
                                          {{ item.start_interval }} - {{ item.end_interval }}
                                        </v-list-item-content>
                                      </v-list-item>
                                    </v-list>
                                  </v-card>
                                </v-col>
                                <v-col cols="6">
                                  <v-card color="indigo darken-5">
                                    <v-card-title class="subheading font-weight-bold white--text">Angka Acak</v-card-title>
                                    <v-divider></v-divider>
                                    <v-list dense>
                                      <v-list-item v-for="i in predictionCount" :key="i">
                                        <v-list-item-content><b>{{ +props.items[props.items.length - 1].label !== +props.items[props.items.length - 1].label ? props.items[props.items.length - 1].label + ' ' + i : parseFloat(props.items[props.items.length - 1].label) + parseFloat(i) }}</b></v-list-item-content>
                                        <v-list-item-content class="align-end">
                                        </v-list-item-content>
                                      </v-list-item>
                                    </v-list>
                                  </v-card>
                                </v-col>
                              </v-row>
                            </template>
                          </v-data-iterator>
                        </div>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </template>
              </div>
              <div v-else>
                <p class="text-center">Pastikan semua data terisi</p>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-app>
  </div>
</template>